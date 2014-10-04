var express = require('express');
var routes = require('./routes/index.js');
var config = require('./config.js');
var async = require('async');

// var Datastore = require('nedb');
// var db = new Datastore({ filename: './myData.db', autoload: true });

//Create the app
var app = express();

//SETTINGS
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//Add the routes
app.get('/',routes.index);

var server = app.listen(config.SERVER_PORT, function() {
	console.log('Listening on port %d', server.address().port);
});


