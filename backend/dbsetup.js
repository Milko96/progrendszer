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
        require('./models/restaurants');
    },
    populate: async () => {
        const userModel = mongoose.model('user');
        
        var count = await userModel.countDocuments();
        if(count !== 0) return;

        const guest = userModel({username: 'Teszt Vendég', password: 'guest', role: 'guest'});
        guest.save();
        const waiter = userModel({username: 'Teszt Pincér', password: 'waiter', role: 'waiter'});
        waiter.save();

        const restaurantModel = mongoose.model('restaurant');
        const restaurant1 = restaurantModel({name: 'John Bull Pub',
            menu: {
                foods: [
                    {name: 'Csárda Gulyás', price: 1100},
                    {name: 'Borjúláb rántva', price: 2500},
                    {name: 'Húsimádók tálja (Egyszemélyes)', price: 2900},
                    {name: 'Harcsapaprikás csuszával', price: 2200},
                    {name: 'Csirkemell rántva', price: 1600}
                ],
                drinks: [
                    {name: 'Eszpresszó kávé', price: 300},
                    {name: 'Cappuccino', price: 350},
                    {name: 'Forró Csokoládé', price: 400},
                    {name: 'Coca-cola', price: 350},
                    {name: 'Fanta (narancs, citrom)', price: 350},
                    {name: 'Újfehértói fürtös ágyas meggypálinka', price: 700}
                ]
            },
            tables: [
                {
                    identifier: 'K1'
                },
                {
                    identifier: 'K2'
                },
                {
                    identifier: 'K3'
                }
            ]});

        restaurant1.save();
    }
};