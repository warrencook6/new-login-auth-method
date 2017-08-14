var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/database');

//HERE WE ARE AT localhost:3000/users/

// Register
router.post('/register', function (req, res, next) {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, function (err, user) {
        if (err) {
            res.json({ success: false, msg: "failed to register user" })
        } else {
            res.json({ success: true, msg: "Registered a new user" })
        }
    });
});


// Authenticate
router.post('/authenticate', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    //Looks for username
    User.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        // If a user is not returned
        if (!user) {
            return res.json({ success: false, msg: "User Not Found!" })
        }

        //If username exists, it checks PW. (candidatePW, hash, callback)
        User.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            //if the password is correct
            if (isMatch) {
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // the token lasts one week. Then you will be forced to sign in again
                });

                // If all clear, Sends some data
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
                //if the password is wrong
            } else {
                return res.json({success: false, msg: "Wrong password"})
            }
        })
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), function (req, res, next) {
    res.json({user: req.user})
});


module.exports = router;