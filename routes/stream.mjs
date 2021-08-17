import route from 'express';
const { Router } = route;
import JWT              from 'jsonwebtoken';
import Hash             from 'hash.js';
import User, { UserRole } from '../models/User.js';
import Livestream from '../models/Livestream.js';
const router = Router();
export default router;

router.use(ensure_auth);
router.get("/:streamId", page_stream);
/**
 * Ensure that all routes in this router can be used only by admin role
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
async function ensure_auth(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "Please login to access this feature!");
		return res.redirect("/auth/user/login");
	}
	else {
		return next();
	}
}

/**
 * Renders the page for live streaming
 * @param {import('express').Request}  req 
 * @param {import('express').Response} res 
 */
async function page_stream(req, res) {
	//	Create a validation token to be used for socket connection
	console.log('streaming page accessed');
	let email = req.cookies['performer'][0]
	let performerV = false;
	if(req.cookies['performer'] !== undefined && req.cookies['performer'][1] == true){
		performerV = true;
	}
	const  token = JWT.sign({
		role: (req.user.role == UserRole.Performer) ? "HOST" : "GUEST",
		userId:   req.user.uuid,
		username: req.user.name,
		streamId: req.params.streamId
	}, "the-key", {});
	const user = await User.findOne({
		where: { email:email, role:UserRole.Performer }
	})
	const livestream = await Livestream.findOne({
		where: { performer:email }
	})
	return res.render("livestream/watch.html", {
		streamId: livestream.uuid,
		userId:   user.uuid,
		username: user.name,
		role:     (user.role == UserRole.Performer) ? "HOST" : "GUEST",
		token:    token,
		performer:performerV
	});
}

async function error_page(req,res){
	return res.render("user/tickets.html")
}