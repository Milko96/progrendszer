const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const userModel = mongoose.model('user');

router.route('/registrate').post(async (req, res) => {
    if(req.body.username && req.body.password) {
        const userWithSameName = await userModel.find({username: req.body.username}, (err, user) => user);
        if(userWithSameName) return res.status(403).send('A felhasználónév már foglalt');
        
        const user = userModel({username: req.body.username, password: req.body.password, role: 'guest'});
        user.save(error => {
            if(error) return res.status(500).send(error);
            return res.status(200).send('Regisztráció sikeres!');
        })
    } else {
        return res.status(400).send('Hiányosak a regisztrálni kívánt user adatai');
    }
})

router.route('/login').post((req, res) => {
    if(req.body.username && req.body.password) {
        passport.authenticate('local', (error, user) => {
            if(error) {
                return res.status(403).send(error);
            } else {
                req.logIn(user, (error, usr) => {
                    if(error) return res.status(500).send('A login sikeres lenne, de serializálni nem tudtunk');
                    return res.status(200).send({id: user._id, username: user.username, role: user.role, waiterAt: user.waiterAt});
                })
            }
        })(req, res);
    } else {
        return res.status(400).send('Hiányos login adatok!');
    }
});

router.route('/logout').post((req, res) => {
    req.logout();
    return res.status(200).send('Kijelentkezés sikeres');
})

module.exports = router;