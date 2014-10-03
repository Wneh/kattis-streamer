var config = {
    //Port that web server listens on
    SERVER_PORT: process.env.PORT || 3000,
    //The whitelist of people that should be viewed
    VIPS: ["Viktor Mattsson","Daniel Hollsten", "Carl Eriksson", "Magnus Gudmandsen"]
}

//Make it global
module.exports = config;