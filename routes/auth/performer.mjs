import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import User, { UserRole } from '../../models/User.js';
import flashMessage from '../../utils/messenger.js';
import passport from 'passport';
import Hash from 'hash.js';
import nunjucks from 'nunjucks';
import SendGrid from '@sendgrid/mail';
import JWT from 'jsonwebtoken';

SendGrid.setApiKey('');

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/login", login_page);
router.post("/login", login_process);
router.get("/signup", register_page);
router.post("/signup", register_process);
router.get("/verify/:token", verify_process);
router.post("/verify/:token", verify_code);

async function login_page(req, res) {
	console.log("Performer Login page accessed");
	return res.render('auth/performer/login.html');
}
async function login_process(req, res, next) {
	console.log("login contents received");
	console.log(req.body);
	let errors = [];
	try {
		const user = await User.findOne({
			where: {
				email: req.body.email,
				password: Hash.sha256().update(req.body.password).digest("hex"),
				role: UserRole.Performer
			}
		});
		if (user) {
			if(user.verified == 1){
				if (!regexEmail.test(req.body.email)) {
					errors = errors.concat({ text: "Invalid email address!" });
				}
				if (!regexPwd.test(req.body.password)) {
					errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character!" });
				}
				if (user.email != req.body.email) {
					errors = errors.concat({ text: "Email does not match" })
				}
				if (user.password != Hash.sha256().update(req.body.password).digest("hex")) {
					errors = errors.concat({ text: "Password does not match" })
				}
				if (errors.length > 0) {
					throw new Error("There are validation errors");
				}
				res.cookie('performer', req.body.email, { maxAge: 900000, httpOnly: true });
				console.log("HERE")
				passport.authenticate('local', {
					successRedirect: "../../performer/dashboard",
					failureRedirect: "auth/performer/login.html",
					failureFlash: true
				})(req, res, next);
				return 
			}
			else{
				errors = errors.concat({text:"Performer is not yet verified. Please check your email."})
				throw new Error("Performer is not yet verified. Please check your email.")
			}
		}
		else{
			errors = errors.concat({text:"Performer not found. Have you signed in?"})
			throw new Error("Performer not found. Have you signed in?")
		}
	}
	catch (error) {
		console.log(error)
		return res.render('auth/performer/login.html', { error: errors });
	}
}
async function register_page(req, res) {
	console.log("performer signup page accessed");
	return res.render('auth/performer/signup.html');
}
async function register_process(req, res) {
	console.log("signup contents received");
	console.log(req.body);
	let errors = [];
	try {
		if (!regexName.test(req.body.name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}
		if (!regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await User.findOne({ where: { email: req.body.email } });
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}
		if (!regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number and one symbol!" });
		}
		if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.log(errors)
		return res.render('auth/performer/signup.html', { error:errors });
	}
	try {
		const user = await User.create({
			email: req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex"),
			name: req.body.name,
			role: UserRole.Performer
		});
		await send_verification(user.uuid, user.email);
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		req.flash('success_msg', 'You have successfully signed in. Please log in');
		return res.redirect("/auth/performer/login");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);
		req.flash('error_msg', 'Something wrong happed within the server.');
		return res.render('auth/performer/signup.html')
	}
}
async function send_verification(uid, email) {
	console.log("sending verification")
	//	DO NOT PUT CREDENTIALS INSIDE PAYLOAD
	//	WHY? -> JWT can be decoded easily
	//		Whats the diff-> Signature don't match if mutated
	const token = JWT.sign({
		uuid: uid
	}, 'the-key', {
		expiresIn: '30000'
	});

	//	Send Grid stuff
	return SendGrid.send({
		to: email,
		from: 'setokurushi@gmail.com',
		subject: `Please verify your email before continuing`,
		html: nunjucks.render(`${process.cwd()}/templates/layouts/performer-email-verify.html`, {
			token: token
		})
	});
}
async function verify_process(req, res) {
	console.log("processing verification")
	const token = req.params.token;
	console.log(req.params.token)
	let uuid = null;
	try {
		const payload = JWT.verify(token, 'the-key');
		uuid = payload.uuid;
	}
	catch (error) {
		console.error(`The token is invalid`);
		console.error(error);
		return res.sendStatus(400).end();
	}
	try {
		const user = await User.findByPk(uuid);
		if(user){
			User.update({
				verified: true
			}, {where:{
				uuid: uuid
				}
			})
			console.log("Performer is now verified")
		}
		else{
			throw new Error("Unable to find Peformer");
		}
		return res.render("auth/performer/verified.html", {
			name: user.name
		});
	}
	catch (error) {
		console.error(`Failed to locate ${uuid}`);
		console.error(error);
		return res.sendStatus(500).end();
	}
}
async function verify_code(req,res){
	console.log(req.body)
	if(req.body.code == "estic"){
		req.flash('success_msg', 'You are now verified.');
		return res.redirect('../login')
	}
	else{
		req.flash('error_msg', 'You are not a real performer');
		return res.redirect('../../../')
	}
}