const router = require('express').Router();
const mongoose = require('mongoose');
const restaurantModel = mongoose.model('restaurant');

router.route('/').get(async (req, res) => {
    if(!req.isAuthenticated()){
        return res.status(403).send('Ehhez be kell jelentkeznie');
    }
    await restaurantModel.find({}, (err, restaurants) => {
        return res.status(200).send(restaurants.map(x => {
            return {_id: x._id, name: x.name}; 
        }))
    });
});

router.route('/:id').get(async (req, res) => {
    if(!req.isAuthenticated()){
        return res.status(403).send('Ehhez be kell jelentkeznie');
    }
    await restaurantModel.findById(req.params.id, (err, restaurant) => {
        return res.status(200).send(restaurant);
    });
});

router.route('/:id/reservation').get(async (req, res) => {
    /*if(!req.isAuthenticated()){
        return res.status(403).send('Ehhez be kell jelentkeznie');
    }*/
    const restaurant = await restaurantModel.findById(req.params.id, (err, restaurant) => {
        if(err){
            return res.status(404).send('Az étterrem nem található');
        }
        return restaurant;
    });
});

module.exports = router;