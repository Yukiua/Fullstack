import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Livestream = db.define('livestream',{
    uuid:{
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    streamId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        defaultValue : 1
    },
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