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
export class Gender {
    static get Male() { return "M"; }
    static get Female(){return "F"; }
}
const User = db.define('user', {
    uuid:{
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    name: {
    type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imgURL:{
        type: Sequelize.STRING,
        defaultValue: 'public/img/default.png',
        allowNull: false
    },
    age:{
        type: Sequelize.NUMBER,
        defaultValue: 0,
        allowNull: false
    },
    gender:{
        type: Sequelize.ENUM(Gender.Male, Gender.Female),
        allowNull: false,
        defaultValue: Gender.Male
    },
    contact:{
        type: Sequelize.NUMBER,
        allowNull: false,
        defaultValue: 00000000
    },
    role:{
        type: Sequelize.ENUM(UserRole.Admin,UserRole.User,UserRole.Performer),
        allowNull:false,
        defaultValue: UserRole.User
    },
    verified:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

export default User;