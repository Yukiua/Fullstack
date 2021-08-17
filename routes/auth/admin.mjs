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

SendGrid.setApiKey('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');

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/login", login_page);
router.post("/login", login_process);
router.get("/retrieveUsers", retrieveUsers);

async function login_page(req, res) {
	console.log("Admin Login page accessed");
	return res.render('auth/admin/login.html');
}

async function retrieveUsers(req, res) {
	console.log("retrieveUsers page accessed");
	const user = await User.findAll({
        where: { role:UserRole.User }
    })
	console.log("user ----> " , user);
	console.log("user length ----> " , user.length);
    return res.render('admin/retrieveUsers.html', {
       	users: user,
        total_users: user.length
    })
}

async function login_process(req, res, next) {
	console.log("admin contents received");
	console.log(req.body);
	let errors = [];
	try {
		const user = await User.findOne({
			where: {
				email: req.body.email,
				password: Hash.sha256().update(req.body.password).digest("hex"),
				role: UserRole.Admin
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
				//res.cookie('user', req.body.email, { maxAge: 900000, httpOnly: true });
				console.log("HERE")
				res.cookie('user',  [req.body.email, false], { maxAge: 900000, httpOnly: true });
				console.log("HERE ", res.cookie["user"]);
				passport.authenticate('local', {
					successRedirect: "../../admin/profile",
					failureRedirect: "auth/admin/profile.html",
					failureFlash: true
				})(req, res, next);
				return 
			}
			else{
				errors = errors.concat({text:"Admin is not yet verified. Please check your email."})
				throw new Error("Admin is not yet verified. Please check your email.")
			}
		}
		else{
			errors = errors.concat({text:"Admin not found. Please try again."})
			throw new Error("Admin not found. Please try again.")
		}
	}
	catch (error) {
		console.log(error)
		return res.render('auth/admin/login.html', { error: errors });
	}
}