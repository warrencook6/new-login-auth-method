var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
var config = require('./config/database')

var port = 3000; 

var app = express();

var users = require('./routes/users');


//Connect to DB
mongoose.connect(config.database);  //whatever you put in the db.js as database

// On connection
mongoose.connection.on('connected', function(){
    console.log('Connected to database '+ config.database)
});

//On Error
mongoose.connection.on('error', function(err){
    console.log('Database error '+ err)
});



//Cors middleware
app.use(cors()); //uses cors


//Static folder
app.use(express.static(path.join(__dirname, 'client')));


//Body Parser MiddleWare
app.use(bodyParser.json())


// Passport Middlewar
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


// Anything /user/whatever goes to users file
app.use('/users', users);


// Index Routes
app.get('/', function(req, res){
    res.send("hello bitch")
})


//Starts Server
app.listen(port, function(){
    console.log('Server listening on port '+ port)
})