import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Cart = db.define('cart',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    price:{
        type: Sequelize.FLOAT,
        allowNull: false
    },
    ticket:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Cart;