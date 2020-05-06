const router = require('express').Router();
const passport = require('passport');

router.route('/login').post((req, res) => {
    if(req.body.username && req.body.password) {
        passport.authenticate('local', (error, user) => {
            if(error) {
                return res.status(403).send(error);
            } else {
                req.logIn(user, (error, usr) => {
                    if(error) return res.status(500).send('A login sikeres lenne, de serializálni nem tudtunk');
                    return res.status(200).send({id: user._id, username: user.username, role: user.role});
                })
            }
        })(req, res);
    } else {
        return res.status(400).send('Hiányos login adatok!');
    }
});

router.route('/logout').post((req, res) => {
    req.logout();
    return res.status(200).send("Kijelentkezés sikeres");
})

module.exports = router;