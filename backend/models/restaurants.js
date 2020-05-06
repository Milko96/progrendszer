const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true},
    openingHour: {type: Number, required: true},
    closingHour: {type: Number, required: true},
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
        identifier: {type: String, unique: true, required: true},
        seats: {type: Number, required: true},
        reservation: {
            type: {
                reservedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
                reservedSeats: {type: Number, required: false},
                datetime: {type: Date, required: false},
                orders: {
                    foods: [{
                        food: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.foods'},
                        quantity: {type: Number, required: false}
                    }],
                    drinks: [{
                        drink: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.drinks'},
                        quantity: {type: Number, required: false}
                    }]
                }
            },
            required: false
        }
    }]
}, {collection: 'restaurants'});

mongoose.model('restaurant', restaurantSchema);