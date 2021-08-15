import route from 'express';
const { Router } = route;
import JWT              from 'jsonwebtoken';
import Hash             from 'hash.js';
import User, { UserRole } from '../models/User.js';
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
	let email = req.cookies['user'][0]
	const  token = JWT.sign({
		role: (req.user.role == UserRole.User) ? "HOST" : "GUEST",
		userId:   req.user.uuid,
		username: req.user.name,
		streamId: req.params.streamId
	}, "the-key", {});
	const user = await User.findOne({
		where: { email:email, role:UserRole.User }
	})
	return res.render("livestream/watch.html", {
		streamId: req.params.streamId,
		userId:   user.uuid,
		username: user.name,
		role:     (user.role == UserRole.User) ? "HOST" : "GUEST",
		token:    token
	});
}
