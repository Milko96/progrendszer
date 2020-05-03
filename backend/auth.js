const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const expressSession = require('express-session');

module.exports = {
    setup: (app) => {
        app.use(expressSession({secret: 'thisshallbemysessionsecret!!'}));

        passport.serializeUser((user, done) => !user ? done('Nincsen user!') : done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
        
        const userModel = mongoose.model('user');

        passport.use('local', new localStrategy((username, password, done) => {
            userModel.findOne({username: username}, (err, user) => {
                if(err || !user) return done("Nem sikerült ilyen felhasználót találni", undefined);
                user.comparePasswords(password, (e, isMatch) => {
                    if(e) return done("Hiba a jelszavak összehasonlításánál", undefined);
                    if(isMatch) return done(null, user);
                    return done("Hibás jelszó", undefined);
                });
            })
        }));

        app.use(passport.initialize());
        app.use(passport.session());
    }
};