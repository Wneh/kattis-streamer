var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var async   = require('async');

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

					var key = "ID";

					console.log("Row: " + i + " Col: " + j);
					console.log(b.text());

					switch(j){
						//ID
						case 1:
							key = "id";
							break;
						//DATE
						case 2:
							key = "date";
							break;
						//AUTHOR
						case 3:
							key = "author";
							break;
						//PROBLEM
						case 4:
							key = "problem";
							break;
						//STATUS
						case 5:
							key = "status";
							break;
						//CPU
						case 6:
							key = "cpu";
							break;
						//LANG:
						case 7:
							key = "lang";
							break;
					}
					row[key] = b.text();
					// console.log(b.text());
				});

				console.log(row);


				// console.log(a.text());
			});
		}

		res.send(200, "OKI");
	});
});

var server = app.listen(config.SERVER_PORT, function() {
    console.log('Listening on port %d', server.address().port);
});
