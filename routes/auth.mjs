import { Router } from 'express';
const router = Router();
export default router;

router.get("/performer_login",async function(req, res) {
	console.log("Performer Login page accessed");
	return res.render('auth/performer_login.html');
});

router.get("/performer_signup", async function(req, res) {
	console.log("Performer SignUp page accessed");
	return res.render('auth/performer_signup.html');
});
