var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var config = require('./../config.js');

var db = new Datastore({ filename: './data.db', autoload: true });

exports.index = function(req, res){

	var data = [];
	var kattisPageNumber = 0;
	var lastId = 0;

	async.series([
		//Get the latest lastId number from the database
		function(callback){
			//Find all documents that have an id, thereafter sort them and pickout the first
			db.find({ "id": { $exists: true } }).sort({"id": -1}.limit(1).exec(function (err, docs) {
				if(err){
					console.log("Something went wrong trying to get the lastest stored submissions id")
					callback(err);
				}

				if(docs.length == 0){
					//No docs found so let the lastID be 0, which is it default value
					callback();
				}

				lastId = docs[0]["id"];
  				// docs is an array containing documents Mars, Earth, Jupiter
  				// If no document is found, docs is equal to []
			});
		},
		//Scrape all the that is missing
		function(callback){
				async.until(
		//Condition
		function(){
			return data.length >= config.LIMIT ;
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
		
	});
		},
		function(callback){

		}
	],
	function(err){
		//Done send back the responce the the user
		if(err){
			res.send(500,err);
		}
		//Render the view for the response
		res.render('index',{data: data});	
	});


};

function scrapePage(pageNumber, callback){

};

