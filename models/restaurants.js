const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true}
}, {collection: 'restaurants'});

mongoose.model('restaurant', restaurantSchema);