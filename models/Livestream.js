import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Livestream = db.define('livestream',{
    title:{
        type: Sequelize.STRING
    },
    info:{
        type: Sequelize.STRING(1000)
    },
    dateLivestream:{
        type: Sequelize.DATE
    }
});

export default Livestream;