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

router.route('/:id').get(async (req, res) => {
    // todo ez működik, csak ne az egész user-t küldjük le, és ez igaz lesz a login-ra is
    await restaurantModel.findById(req.params.id)
        .populate('tables.reservations.reservedBy')
        .exec((err, restaurant) => {
        return res.status(200).send(restaurant);
    });
});

router.route('/:id/reservation').post(async (req, res) => {
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

        console.log('reservationsToday', reservationsToday);
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

            console.log('reservation', reservation);
            console.log('nextReservation', nextReservation);
            
            var diffTime = Math.abs(reservation.datetime - nextReservation.datetime);
            console.log('diffTime', diffTime);
            var diffInHours = Math.ceil(diffTime / (1000 * 60 * 60))
            console.log('diffInHours', diffInHours);
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
        console.log('canReserve', canReserve);
        restaurant.save();
        return res.status(200).send('Sikeres foglalás');
    }else {
        return res.status(400).send('Sajnos nem találtunk megfelelő méretű szabad asztalt a kért időpontban');
    }
});

module.exports = router;