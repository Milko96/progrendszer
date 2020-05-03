const router = require('express').Router();
const passport = require('passport');

router.route('/health-check').get((req, res) => res.status(200).send('Az api elérhető'));

router.route('/login').post((req, res) => {
    if(req.body.username && req.body.password) {
        passport.authenticate('local', (error, username) => {
            if(error) {
                res.status(403).send(error);
            } else {
                req.logIn(username, (error, usr) => {
                    if(error) return res.status(500).send('A login sikeres lenne, de serializálni nem tudtunk');
                    return res.status(200).send('Login sikeres');
                })
            }
        })(req, res);
    } else {
        console.log('')
        return res.status(400).send('Hiányos login adatok!');
    }
});

router.route('/logout').post((req, res) => {
    if(req.isAuthenticated()) {
        req.logout();
        res.status(200).send("Kijelentkezés sikeres");
    }
    return res.status(403).send("Előbb jelentkezz be, mielőtt kijelentkezel!");
})

module.exports = router;