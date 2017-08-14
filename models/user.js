var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/database');

var UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var User = module.exports = mongoose.model("User", UserSchema);

// getUserById Function
module.exports.getUserById = function(id, callback){
    User.findById(id, callback)
};

// getUserByUsername Function
module.exports.getUserByUsername = function(username, callback){
    var query = {username: username}
    User.findOne(query, callback)
};

// addUser Function
module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hashh(newUser.password, salt, function(err, hash){
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}

// Compare PW Function
module.exports.comparePassword = function (candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch){
        if (err) throw err
        callback(null, isMatch)
    });
}