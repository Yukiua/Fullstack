/**
 * This example uses Nunjucks template engine for rendering pages
 */

import Express         from 'express';
import session         from 'express-session';
import BodyParser      from 'body-parser';
import CookieParser    from 'cookie-parser';
import MethodOverrides from 'method-override';
import Path            from 'path';
import MySQLStore      from 'express-mysql-session';
import Nunjcks         from 'nunjucks';
import ESTICDB         from './config/DBConnection.js';
import db              from './config/db.js'
import FlashConnect    from 'connect-flash'
import FlashMessenger  from 'flash-messenger'
import passport        from 'passport';
import Http             from 'http';
import { initialize_https } from './utils/https.mjs';


const Server = Express();
const Port   = process.env.PORT || 3000;

const ServerHttp  = Http.createServer(Server);
const ServerHttps = initialize_https(Server);

/**
 * Template Engine
 * You may choose to use Nunjucks if you want to recycle everything from your old project.
 * Strongly recommended. However, do note the minor differences in syntax. :)
 * Trust me it saves your time more.
 * https://www.npmjs.com/package/express-nunjucks
 */
Nunjcks.configure('templates', {
	autoescape: true,
	express:    Server
})
//	Sets `/public` to be the virtual path to access static files
Server.use("/public", Express.static('public'));
/**
 * Form body parsers etc
 */
Server.use(BodyParser.urlencoded( { extended: false }));
Server.use(BodyParser.json());
Server.use(CookieParser());
Server.use(MethodOverrides('_method'));

/**
 * Express Session, using mysql
 */
Server.use(session({
	key: 'ESTIC_session',
	secret: 'ESTIC',
	store: new MySQLStore({
		createDatabaseTable: true,
		schema: {
			tableName: 'SESSIONS',
			columnNames: {
				session_id: 'session_id',
				expires: 'expires',
				data:'data'
			}
		},
		host: db.host,
		port: 3306,
		user: db.user,
		password: db.password,
		database: db.database,
		// clearExpired: true,
		// // How frequently expired sessions will be cleared; milliseconds:
		// checkExpirationInterval: 900000,
		// // The maximum age of a valid session; milliseconds:
		// expiration: 900000,
	}),
	resave: false,
	saveUnintialized: false,
}));


//-----------------------------------------

/**
 * TODO: Setup global contexts here. Basically stuff your variables in locals
 */
Server.use(FlashConnect());
Server.use(FlashMessenger.middleware);
Server.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});


ESTICDB.setUpDB(false)
import { initialize_passport } from './config/passport.js'
initialize_passport(Server);
Server.use(passport.initialize());
Server.use(passport.session());

import Routes from './routes/main.mjs'
Server.use("/", Routes);

/**
 * DEBUG USAGE
 * Use this to check your routes
 * Prints all the routes registered into the application
**/
import { ListRoutes } from './utils/routes.mjs'
console.log(`=====Registered Routes=====`);
ListRoutes(Server._router).forEach(route => {
	console.log(`${route.method.padStart(8)} | /${route.path}`);
});
console.log(`===========================`);

import { initialize_socket } from './utils/socket.mjs';
initialize_socket(Server, ServerHttps);
/**
 * Start the server in infinite loop
 */
ServerHttp.listen(Port, function() {
    console.log("Server listening at port ${Port}");
	console.log("http://localhost:3000")
});

ServerHttps.listen(443, function () {
    console.log("Server listening at port ${443}");
});

