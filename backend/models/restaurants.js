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
        identifier: {type: String, unique: true, required: true},
        seats: {type: Number, required: true},
        reservation: {
            reservedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
            reservedSeats: {type: Number, required: true},
            datetime: {type: Date, required: true},
            orders: {
                foods: [{
                    food: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.foods'},
                    quantity: {type: Number, required: true}
                }],
                drinks: [{
                    drink: {type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.drinks'},
                    quantity: {type: Number, required: true}
                }]
            }
        }
    }]
}, {collection: 'restaurants'});

mongoose.model('restaurant', restaurantSchema);