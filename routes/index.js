var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var config = require('./../config.js');

exports.index = function(req, res){
	var url = 'https://kth.kattis.com/submissions'

	request(url, function(error, response, html){
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
				var data = [];
				var row = {};
				var numberRow = 0;
				$('td').each(function(j,col){
					var b = $(this);

					var key = "ID";
					var saveData = false;

					switch(j-(7*numberRow)){
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
						case 6: "value", 
							key = "lang";
							numberRow++;
							saveData = true;
							break;
					}
					row[key] = b.text();

					if(saveData){
						var linenumber = numberRow;
						// console.log(linenumber + ": " + JSON.stringify(row));
						//CHeck if this is person of interest
						if(config.names[row["author"]]){
							data.push(row);
						}
						row = {};
					}
				});
		}
		//Render the view for the response
		res.render('index',{data: data});
	});
};

