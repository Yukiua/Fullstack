import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import User from '../models/User.js';
import Performer from '../models/Performer.js';
import CookieParser    from 'cookie-parser';
import { flashMessage }  from '../utils/messenger.js';
import passport from 'passport';
import Hash     from 'hash.js';
import cookieParser from 'cookie-parser';

/**
 * Regular expressions for form testing
 **/ 
 const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 //	Min 3 character, must start with alphabet
 const regexName  = /^[a-zA-Z][a-zA-Z]{2,}$/;
 //	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
 const regexPwd   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
router.get("/login",     login_page);
router.post("/login",    login_process);
router.get("/signup",  register_page);
router.post("/signup", register_process);

async function login_page(req, res) {
	console.log("Performer Login page accessed");
	return res.render('auth/performer/login.html');
}

async function login_process(req, res, next) {
	console.log("login contents received");
	console.log(req.body);

	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
        const performer = await Performer.findOne({where: {
			email: req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex")
		}});
        if(performer){
			res.cookie('performer', req.body.email,{maxAge: 900000, httpOnly: true});
			console.log("HERE")
			passport.authenticate('local', {
				successRedirect: "../../performer/dashboard",
				failureRedirect: "auth/performer/login.html",
				failureFlash:    true
			})(req, res, next);		
			return 
		}
        else {
            }
            if (! regexEmail.test(req.body.email)) {
                errors = errors.concat({ text: "Invalid email address!" });
            }

            if (! regexPwd.test(req.body.password)) {
                errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!" });
            }
            if(performer.email != req.body.email){
                errors = errors.concat({ text: "Email does not match"})
            }
            if(performer.password != req.body.password){
                errors = errors.concat({text: "Password does not match"})
            }

            if (errors.length > 0) {
                throw new Error("There are validation errors");
            }
        }
	catch (error) {
		console.error("There is errors with the login form body.");
		console.error(error);
		return res.render('auth/performer/login.html', { errors: errors });
	}

	return successRedirect

	// try {
	// 	const user = await ModelUser.findOne({where: {
	// 		email: req.body.email,
	// 		password: Hash.sha256().update(req.body.password).digest("hex")
	// 	}});


	// 	if (user == null) {
	// 		errors = errors.concat({ text: "Invalid user credentials!" });
	// 	}

	// 	if (errors.length > 0) {
	// 		throw new Error("There are validation errors");
	// 	}
	// 	else {
	// 		flashMessage(res, 'success', 'Successfully login!', 'fas fa-sign-in-alt', true);
	// 		return res.redirect("/home");
	// 	}
	// }
	// catch (error) {
	// 	console.error(`Credentials problem: ${req.body.email} ${req.body.password}`);
	// 	console.error(error);
	// 	return res.render('auth/login', { errors: errors });
	// }
}

async function register_page(req, res) {
	console.log("performer signup page accessed");
	return res.render('auth/performer/signup.html');
}

async function register_process(req, res) {
	console.log("signup contents received");
	console.log(req.body);
	let errors = [];
	//	Check your Form contents
	//	Basic IF ELSE STUFF no excuse not to be able to do this alone
	//	Common Sense
	try {
		if (! regexName.test(req.body.name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}

		if (! regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const performer = await Performer.findOne({where: {email: req.body.email}});
			if (performer != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}

		if (! regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number and one symbol!" });
		}
		else if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}

		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.error("There is errors with the registration form body.");
		console.error(errors);
		return res.render('auth/performer/signup.html', { errors: errors });
	}

	//	Create new user, now that all the test above passed
	try {
		const performer = await Performer.create({
				email:    req.body.email,
				password: Hash.sha256().update(req.body.password).digest("hex"),
				name:     req.body.name,
		});
		const user = await User.create({
			email:    req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex"),
			name:     req.body.name,
	});

		// //	Retrieve list of contents in your table
		// const list = Performer.findAll({
		// 	where: {

		// 	},
		// 	limit: 20,
		// 	offset: 30
		// });

		// //	Delete
		// ModelUser.destroy({
		// 	where: {

		// 	}
		// });

		// //	Update
		// await (await ModelUser.findOne()).update();

		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		return res.redirect("/auth/performer/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);
		return res.status(500).end();
	}
}