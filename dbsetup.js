const mongoose = require('mongoose');

module.exports = {
    connect: () => {
        const dbUrl = "mongodb://localhost:27017";
        
        mongoose.connect(dbUrl);
        
        mongoose.connection.on('connected', () => {
            console.log('kapcsolódva a mongodb-re');
        });
        
        mongoose.connection.on('error', (err) => {
            console.log('hiba a mongodb kapcsolódás során', err);
        });
        
        require('./models/users');
    },
    populate: async () => {
        const userModel = mongoose.model('user');
        
        var count = await userModel.countDocuments();
        if(count !== 0) return;

        const guest = userModel({username: 'Teszt Vendég', password: 'guest', role: 'guest'});
        guest.save();
        const waiter = userModel({username: 'Teszt Pincér', password: 'waiter', role: 'waiter'});
        waiter.save();
    }
};