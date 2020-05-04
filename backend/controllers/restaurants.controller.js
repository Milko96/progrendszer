const router = require('express').Router();
const mongoose = require('mongoose');
const restaurantModel = mongoose.model('restaurant');

router.route('/').get(async (req, res) => {
    /*if(!req.isAuthenticated()){
        return res.status(403).send('Ehhez be kell jelentkeznie');
    }*/
    await restaurantModel.find({}, (err, restaurants) => {
        res.status(200).send(restaurants.map(x => {
            return {_id: x._id, name: x.name}; 
        }))
    });
});

router.route('/:id').get(async (req, res) => {
    /*if(!req.isAuthenticated()){
        return res.status(403).send('Ehhez be kell jelentkeznie');
    }*/
    await restaurantModel.find({_id: req.params.id}, (err, restaurant) => {
        res.status(200).send(restaurant.map(x => {
            return {
                _id: x._id,
                name: x.name,
                menu: x.menu,
                tables: x.tables
            }; 
        }))
    });
});

module.exports = router;