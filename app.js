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
				var row = {};
				$('td').each(function(j,col){
					var b = $(this).prev();

					var key = "DEFAULT";

					switch(j){
						//ID
						case 0:
							key = "id";
							break;
						//DATE
						case 1:
							key = "date";
							break;
						//AUTHOR
						case 2:
							key = "author";
							break;
						//PROBLEM
						case 3:
							key = "problem";
							break;
						//STATUS
						case 4:
							key = "status";
							break;
						//CPU
						case 5:
							key = "cpu";
							break;
						//LANG:
						case 6:
							key = "lang";
							break;

					}
					console.log(b.text());
				});


				// console.log(a.text());
			});
		}

		res.send(200, "OKI");
	});
});

var server = app.listen(config.SERVER_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
