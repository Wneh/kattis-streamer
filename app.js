var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var config = require('./config.js');

app.get('/scrape', function(req, res){
	
	//url = 'http://www.imdb.com/title/tt1229340/';
	var url = 'https://kth.kattis.com/submissions'

	request(url, function(error, response, html){
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			$('tr').each(function(i, element){
				var a = $(this).prev();



				console.log(a.text());
			});
		}

		res.send(200, "OKI");
	});
});

var server = app.listen(config.SERVER_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
