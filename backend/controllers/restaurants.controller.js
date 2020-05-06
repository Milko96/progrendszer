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

    var canReserve = false;
    const tablesBigEnough = restaurant.tables.filter(x => x.seats >= reservedSeats);
    if(!(Array.isArray(tablesBigEnough) && tablesBigEnough.length)){
        return res.status(400).send('Nincs ekkora asztal');
    }

    // a megfelelő méretű asztalok közül minél kisebbet kell lefoglalni
    for(let table of tablesBigEnough.sort((a,b) => a.seats - b.seats)){
        const reservationsToday = table.reservations.filter(x => {
            return new Date(x.datetime.getTime()).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)
        });
        reservationsToday.sort((a,b) => a.datetime.getTime() - b.datetime.getTime());

        if(Array.isArray(reservationsToday) && reservationsToday.length){
            for(let i = 0; i < reservationsToday.length - 1; i++) {
                var reservation = reservationsToday[i];
                // todo 3 óra legyen minimum 2 foglalás közt, illetve férjen bele a nyitás és zárás közé a 3 óra
                if(restaurant.openingHour <= reservation.getHours()){

                }
            }
        }else {
            // nincs mára foglalás
            canReserve = true;
            break;
        }
    }

    if(canReserve){
        // todo restaurantba rögzíteni
    }else {
        return res.status(400).send('Sajnos nem találtunk megfelelő méretű szabad asztalt a kért időpontban');
    }
});

module.exports = router;