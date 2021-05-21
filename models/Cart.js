import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Cart = db.define('cart',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING
    },
    price:{
        type: Sequelize.FLOAT
    },
    ticket:{
        type: Sequelize.STRING
    }
});

export default Cart;