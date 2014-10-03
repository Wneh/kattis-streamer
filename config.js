var config = {
    //Port that web server listens on
    SERVER_PORT: process.env.PORT || 3000,

    VIPS: ["Viktor Mattsson","Daniel Hollsten", "Carl Eriksson", "Magnus Gudmandsen"]
}

//Make it global
module.exports = config;