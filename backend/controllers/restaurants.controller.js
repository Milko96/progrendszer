const router = require('express').Router();
const mongoose = require('mongoose');
const restaurantModel = mongoose.model('restaurant');

router.route('/').get(async (req, res) => {
    await restaurantModel.find({}, (err, restaurants) => {
        return res.status(200).send(restaurants.map(x => {
            return {_id: x._id, name: x.name};
        }))
    });
});

router.route('/:id/basic').get(async (req, res) => {
    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err) return res.status(404).send('Az étterem nem található');
        return restaurant;
    });

    return res.status(200).send({
        _id: restaurant._id,
        name: restaurant.name,
        openingHour: restaurant.openingHour,
        closingHour: restaurant.closingHour,
        menu: restaurant.menu
    });
});

router.route('/:id').get(async (req, res) => {
    if(req.user.role !== 'waiter') return res.status(403).send('A foglalásokhoz nincs hozzáférése');
    await restaurantModel.findById(req.params.id)
        .populate('tables.reservations.reservedBy', 'username')
        .exec((err, restaurant) => {
            if(err) return res.status(404).send('Az étterem nem található');
            return res.status(200).send(restaurant);
        });
});

router.route('/:id/reservations').post(async (req, res) => {
    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err) return res.status(404).send('Az étterem nem található');
        return restaurant;
    });

    const datetime = new Date(req.body.datetime);
    const reservedSeats = req.body.reservedSeats;

    if(restaurant.openingHour > datetime.getHours())
        return res.status(400).send('Az nyitás időpontja előtt van');
    if((datetime.getHours() + 3) > restaurant.closingHour)
        return res.status(400).send('Az zárási időpont előtt minimum 3 órával lehet csak asztalt foglalni');

    const tablesBigEnough = restaurant.tables.filter(x => x.seats >= reservedSeats);
    if(!(Array.isArray(tablesBigEnough) && tablesBigEnough.length)){
        return res.status(400).send('Nincs ekkora asztal');
    }

    var canReserve = false;
    for(let table of tablesBigEnough){
        if(canReserve){
            break;
        }

        const reservationsToday = table.reservations.filter(x => {
            return new Date(x.datetime.getTime()).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
        });

        // a validációhoz push-olom, de más a referencia, ezért nincs benne az étteremben
        reservationsToday.push({
            reservedBy: req.user._id,
            reservedSeats: reservedSeats,
            datetime: datetime
        });

        // nincs mára foglalás az újon kívül
        if((Array.isArray(reservationsToday) && reservationsToday.length == 1)){
            canReserve = true;
            table.reservations.push({
                reservedBy: req.user._id,
                reservedSeats: reservedSeats,
                datetime: datetime
            });
            break;
        }

        reservationsToday.sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
        let areReservationsCompatible = true;
        for(let i = 0; i < reservationsToday.length - 1; i++) {
            var reservation = reservationsToday[i];
            var nextReservation = reservationsToday[i + 1];
            
            var diffTime = Math.abs(reservation.datetime - nextReservation.datetime);
            var diffInHours = Math.ceil(diffTime / (1000 * 60 * 60))
            // ha a foglalások közt van olyan, ahol nincs legalább 3 óra különbség
            if(diffInHours < 3) {
                areReservationsCompatible = false;
                break;
            }
        }

        if(areReservationsCompatible){
            canReserve = true;
            table.reservations.push({
                reservedBy: req.user._id,
                reservedSeats: reservedSeats,
                datetime: datetime
            });
            break;
        }
    }

    if(canReserve){
        restaurant.save();
        return res.status(200).send('Sikeres foglalás');
    }else {
        return res.status(400).send('Sajnos nem találtunk megfelelő méretű szabad asztalt a kért időpontban');
    }
});


router.route('/:id/reservations/:reservationId').delete(async (req, res) => {
    if(req.user.role !== 'waiter') return res.status(403).send('A foglalásokhoz nincs hozzáférése');

    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err) return res.status(404).send('Az étterem nem található');
        return restaurant;
    });

    const tableIndex = restaurant.tables.findIndex(table => table.reservations.some(reservation => reservation._id == req.params.reservationId));
    if(tableIndex === -1) return res.status(404).send('A foglalás nem található');

    const reservationIndex = restaurant.tables[tableIndex].reservations.findIndex(reservation => reservation._id == req.params.reservationId);

    restaurant.tables[tableIndex].reservations[reservationIndex].remove();
    restaurant.save();
    return res.status(200).send('Foglalás törölve');
});

router.route('/:id/reservations/:reservationId/order-food').patch(async (req, res) => {
    if(req.user.role !== 'waiter') return res.status(403).send('A foglalásokhoz nincs hozzáférése');

    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err) return res.status(404).send('Az étterem nem található');
        return restaurant;
    });

    const tableIndex = restaurant.tables.findIndex(table => table.reservations.some(reservation => reservation._id == req.params.reservationId));
    if(tableIndex === -1) return res.status(404).send('A foglalás nem található');

    const reservation = restaurant.tables[tableIndex].reservations.find(reservation => reservation._id == req.params.reservationId);

    const foodIndex = reservation.orders.foods.findIndex(food => food.foodId == req.body._id);
    if(foodIndex === -1){
        reservation.orders.foods.push({foodId: req.body._id, quantity: req.body.quantity});
    }else{
        reservation.orders.foods[foodIndex].quantity += req.body.quantity;
    }

    restaurant.save();

    return res.status(200).send('Rendelés rögzítve');
});

router.route('/:id/reservations/:reservationId/order-drink').patch(async (req, res) => {
    if(req.user.role !== 'waiter') return res.status(403).send('A foglalásokhoz nincs hozzáférése');

    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err) return res.status(404).send('Az étterem nem található');
        return restaurant;
    });

    const tableIndex = restaurant.tables.findIndex(table => table.reservations.some(reservation => reservation._id == req.params.reservationId));
    if(tableIndex === -1) return res.status(404).send('A foglalás nem található');

    const reservation = restaurant.tables[tableIndex].reservations.find(reservation => reservation._id == req.params.reservationId);

    const drinkIndex = reservation.orders.drinks.findIndex(drink => drink.drinkId == req.body._id);
    if(drinkIndex === -1){
        reservation.orders.drinks.push({drinkId: req.body._id, quantity: req.body.quantity});
    }else{
        reservation.orders.drinks[drinkIndex].quantity += req.body.quantity;
    }

    restaurant.save();

    return res.status(200).send('Rendelés rögzítve');
});

module.exports = router;