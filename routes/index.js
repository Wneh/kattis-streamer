var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var config = require('./../config.js');

var db = new Datastore({ filename: './data.db', autoload: true });

exports.index = function(req, res){

	var data = [];
	var kattisPageNumber = 0;


	async.series([
		//Scrape all the that is missing
		function(callback){

		},
		function(callback){

		}
	],
	function(err){
		//Done send back the responce the the user
	});

	async.until (
		//Condition
		function(){
			return data.length >= config.LIMIT;
		}
		//Do this until the condition is true
		,function(callback){
		// console.log("Number of pages: " + kattisPageNumber);
		var url = 'https://kth.kattis.com/submissions?page='+kattisPageNumber;
		request(url, function (error, response, html){
			if (!error && response.statusCode == 200) {
				var $ = cheerio.load(html);
					
				var row = {};
				var numberRow = 0;
				
				$('td').each(function(j,col){
					var b = $(this);

					var key = "ID";
					var saveData = false;

					switch(j-(7*numberRow)){
						//index
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
						//Check if this is person of interest
						if(config.names[row["author"]]){
							data.push(row);
						}
						row = {};
					}
				});
				kattisPageNumber++;
				callback();
			}
			else {
				callback(error);
			}
		});
	},
	//Done send back to the user
	function(err){
		if(err){
			res.send(500,err);
		}
		//Render the view for the response
		res.render('index',{data: data});	
	});
};

function scrapePage(callback){
	
};

