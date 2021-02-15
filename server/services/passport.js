const passport          = require('passport');
const LocalStrategy     = require('passport-local').Strategy;
const validPassword     = require('./password_utils').validPassword;
//const connectDB         = require('.././database/connection');
//const User              = connectDB.models.Userdb;
const User              = require('../model/model').Userdb;

const verifyCallback = (username, password, done) => {
    //console.log('Am apelat PASSPORT CALLBACK');
    User.findOne({ email: username })
    .then((user) => {      
        if(!user){
            return done(null, false);
        }  
        const isValidPass = validPassword(password, user.hash, user.salt);
        if(isValidPass) {
            //if(true) {
                //console.log('Am gasit userul');
            return done(null, user);
        } else {
            return done(null, false);
        }    
    })
    .catch((err) => {
        done(err);
    });
}

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});

