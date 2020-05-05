const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    requiredSeats: {type: Number, required: true},
    reservedFor: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    tables: [{type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.tables'}],
    orders: {
        foods: [{type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.foods'}],
        drinks: [{type: mongoose.Schema.Types.ObjectId, ref: 'restaurant.menu.drinks'}],
        totalPrice: {type: Number, required: true}
    }
}, {collection: 'reservations'});


mongoose.model('reservation', reservationSchema);