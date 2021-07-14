import Sequelize from 'sequelize';
import db from '../config/DBConfig.js';

/* Creates a user(s) table in MySQL Database.
Note that Sequelize automatically pleuralizes the entity name as the table name
*/
export class UserRole {
	static get Admin() { return "admin"; }
	static get User()  { return "user";  }
    static get Performer() { return "performer"; }
}

const User = db.define('user', {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: 1,
    },
    name: {
    type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    imgURL:{
        type: Sequelize.STRING,
        defaultValue: '',
        allowNull: false
    },
    role:{
        type: Sequelize.ENUM(UserRole.Admin,UserRole.User,UserRole.Performer),
        allowNull:false,
        defaultValue: UserRole.User
    }
});

export default User;