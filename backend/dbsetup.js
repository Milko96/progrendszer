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
        await guest.save();

        const restaurantModel = mongoose.model('restaurant');
        const kapca = restaurantModel({
            name: 'Kapca Kávézó és Bisztró',
            openingHour: 10,
            closingHour: 23,
            menu: {
                foods: [
                    {name: 'Bivalygulyás', price: 1090},
                    {name: 'BASE Hamburger', price: 2190},
                    {name: 'GYEREK Burger', price: 1290},
                    {name: 'Kacsa comb', price: 2490},
                    {name: 'Lasagne', price: 1790},
                    {name: 'Madártej', price: 690}
                ],
                drinks: [
                    {name: 'Espresso', price: 350},
                    {name: 'Cappuccino', price: 420},
                    {name: 'Cortado', price: 420},
                    {name: 'Limonádé (0,3 l)', price: 390},
                    {name: 'Szigetközi víz - mentes (0,5 l)', price: 400}
                ]
            },
            tables: [
                {identifier: '1/2', seats: 2},
                {identifier: '2/2', seats: 2},
                {identifier: '1/4', seats: 4},
                {identifier: '2/4', seats: 4},
                {identifier: '3/4', seats: 4},
                {identifier: '4/4', seats: 4}
            ]
        });
        await kapca.save();

        const savedGuest = await userModel.findOne({username: guest.username}, (err, user) => user);
        const kiskakas = restaurantModel({
            name: 'Kiskakas Csárda',
            openingHour: 9,
            closingHour: 20,
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
                    identifier: 'K1',
                    seats: 4,
                    reservations: [{
                        reservedBy: savedGuest._id,
                        reservedSeats: 4,
                        datetime: '2020-05-07T15:00:00Z'
                    }]
                },
                {identifier: 'K2', seats: 6},
                {identifier: 'K3', seats: 8}
            ]
        });
        await kiskakas.save();

        const savedKiskakas = await restaurantModel.findOne({name: kiskakas.name}, (err, restaurant) => restaurant);
        const waiter = userModel({username: 'Teszt Pincér', password: 'waiter', role: 'waiter', waiterAt: savedKiskakas._id});
        await waiter.save();
    }
};