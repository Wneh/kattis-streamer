var express = require('express');
var routes   = require('./routes/index.js');
var config = require('./config.js');

//Create the app
var app     = express();

//SETTINGS
app.set('views', __dirname + '/views');
app.set('view engine', 'jade')

//Add the routes
app.get('/',routes.index);

//Start the server
var server = app.listen(config.SERVER_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
