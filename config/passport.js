const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Users = mongoose.model('Users');

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        (email, password, done) => {
            Users.findOne({
                email: email
            })
                .then(data => {
                    if (!data) {
                        return done(null, false, { message: 'Please register if your email address does not exist...' })
                    } else {
                        bcrypt.compare(password, data.password, (err, isMath) => {
                            if (err) throw err;
                            if (isMath) {
                                return done(null, data)
                            } else {
                                return done(null, false, { message: 'Password input error...' })
                            }
                        });
                    }
                })
        }
    ));

    // passport序列化持久化
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        Users.findById(id, (err, user) => {
            done(err, user);
        });
    });
}