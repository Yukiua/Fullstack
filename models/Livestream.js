const Sequilize = require('sequelize');
const sequelize = require('../config/DBConfig');
const db = require('../config/DBConfig');

const Livestream = db.define('livestream',{
    title:{
        type: Sequilize.STRING
    },
    info:{
        type: Sequilize.STRING(1000)
    },
    dateLivestream:{
        type: Sequilize.DATE
    }
});

module.exports = Livestream;