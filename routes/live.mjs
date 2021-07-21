import { Router }       from 'express';
import JWT              from 'jsonwebtoken';
import Hash             from 'hash.js';
import { UserRole }     from '';
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
	const  token = JWT.sign({
		role: (req.user.role == UserRole.Admin) ? "HOST" : "GUEST",
		userId:   req.user.uuid,
		username: req.user.name,
		streamId: req.params.streamId
	}, "the-key", {});

	return res.render("/stream/watch", {
		streamId: req.params.streamId,
		userId:   req.user.uuid,
		username: req.user.name,
		role:     (req.user.role == UserRole.Admin) ? "HOST" : "GUEST",
		token:    token
	});
}
