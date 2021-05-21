import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

const Cart = db.define('cart',{
    id:{
        type: Sequelize.INTEGER
    },
    title:{
        type: Sequelize.STRING
    },
    price:{
        type: Sequelize.FLOAT(INTEGER)
    },
    ticket:{
        type: Sequelize.STRING
    }
});

export default Cart;