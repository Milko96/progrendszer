const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true} // guest or waiter
}, {collection: 'users'});

userSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')) {;
        bcrypt.genSalt(10, function(error, salt) {
            if(error) {
                return next(error);
            } else {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if(err) {
                        return next(err);
                    }
                    user.password = hash;
                    return next();
                })
            }
        })
    } else {
        return next();
    }
});

userSchema.methods.comparePasswords = function(password, next) {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        return next(error, isMatch);
    })
};

mongoose.model('user', userSchema);