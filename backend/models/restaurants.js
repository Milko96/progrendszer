const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    menu: {
        foods: [{
            name: {type: String, required: true},
            price: {type: Number, required: true}
        }],
        drinks: [{
            name: {type: String, required: true},
            price: {type: Number, required: true}
        }]
    },
    tables: [{
        identifier: {type: String, unique: true, required: true}
    }]
}, {collection: 'restaurants'});

mongoose.model('restaurant', restaurantSchema);