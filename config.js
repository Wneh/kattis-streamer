var config = {
    //Port that web server listens on
    SERVER_PORT: process.env.PORT || 3000,
    LIMIT: 30,
    //The whitelist of people that should be viewed
    VIP: ["Viktor Mattsson",
    	  "Daniel Hollsten",
    	  "Carl Eriksson",
    	  "Magnus Gudmandsen",
    	  "Mikael Florén",
    	  "Christopher Teljstedt",
          "Philip Eliasson",
          "Henrik Viksten"]
}

//Creates a lookup table for all of the people in the VIP vector
var generateLookupTable = function(){
	var vip = config["VIP"];
	config["names"] = {};
	for(var i = 0; i < vip.length; i++){
		config["names"][vip[i]] = true;
	}
};

//Call it
generateLookupTable();

//Make it global
module.exports = config;