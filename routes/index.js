var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');
var config = require('./../config.js');

// var Datastore = require('nedb');
// var db = new Datastore({ filename: './myData.db', autoload: true });
// var Datastore = require('nedb'),                                                                                                                                              
//     path = require('path'),
//     db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'data.db'), autoload: true });

var Datastore = require('nedb')
  , db = new Datastore({ filename: 'db/data', autoload: true });

exports.index = function(req, res){

	var data = [];
	var kattisPageNumber = 0;
	var lastId = 0;

	async.series([
		//Series 1 - Get the latest lastId number from the database
		function (callback){
			//Find all documents that have an id, thereafter sort them and pickout the first
			db.find({ "id": { $exists: true } }).sort({"id": -1}).limit(1).exec(function (err, docs) {
				if(err){
					console.log("Something went wrong trying to get the lastest stored submissions id")
					callback(err);
				}

				if(docs.length == 0){
					//No docs found so let the lastID be 0, which is it default value
				} else {
					lastId = docs[0]["id"];
					console.log("Last id is: " + lastId);
				}
				callback();
				
  				// docs is an array containing documents Mars, Earth, Jupiter
  				// If no document is found, docs is equal to []
			});
		},
		//Series 2 - Scrape all the that is missing
		function (callbackSeries){

				var numberOfFoundDocuments = 0;
				//Really large number since the firstime we dont know the current id yet
				var currentId = 999999999999;

				async.until(
					//Condition
					function (){
						console.log(numberOfFoundDocuments+ " >= "+config.LIMIT + " || " + currentId + " <= " + lastId);

						return numberOfFoundDocuments >= config.LIMIT || currentId <= lastId;
					}
					//Do this until the condition is true
					,function (callback){
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

								//We just got our self a row of data
								if(saveData){
									//Save the currentId of this row
									currentId = row["id"];
									console.log(row);
									//Check if this is person of interest
									if(config.names[row["author"]]){
										//Check if we done have it already
										if(row["id"] > lastId){
											//Before we insert it we need to fix the date format.
											var fixedRow = fixDate(row);

											//Insert it to the database
											db.insert(fixedRow, function (err, newDoc){
												if(err){
													callback(err);
												}
												console.log("Added new document to the database");
												numberOfFoundDocuments++;
												//Document was inserted
											});
										}
									}	
									//Empty the row
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
				function (err){
					//Check for errors
					if(err){
						callbackSeries(err);
					}
					//No error so just continue
					callbackSeries();
				});
		},
		//Series 3 - Extract the data from the database
		function (callback){
			db.find().sort({"id": -1}).limit(config.LIMIT).exec(function (err, docs) {
				if(err){
					callback(err);
				}
				//Found the documents so pass it along
				callback(null,docs);
			});
		}
	],
	function (err,results){
		//Done send back the responce the the user
		if(err){
			res.send(500,err);
		}
		//Render the view for the response
		res.render('index',{data: results[2]});	
	});


};

function fixDate(row){
	var originalDate = row["date"];

	if(originalDate.substring(0,4) != "2014"){
		var today = new Date();
		var month = today.getMonth() + 1;
		row["date"] = today.getFullYear() + "-" + month + "-" + today.getDate() + " " + originalDate;
	}
	return row;
}

