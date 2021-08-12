import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import User, { UserRole } from '../../models/User.js';
import { ensureAuthenticated } from '../../config/authenticate.js';
import SettingsOptions from './settings.mjs'
router.use("/settings", SettingsOptions)

router.get("/profile", user_profile);
router.get("/watchLivestream", watchLive_page);
router.get("/logout", ensureAuthenticated, logout_page);
router.get("/settings", ensureAuthenticated, settings_page);

async function user_profile(req,res) {
    console.log("User profile page accessed");
    let email = req.cookies['user']
    const user = await User.findOne({
        where: { email: email, role:UserRole.Performer }
    })
    return res.render('user/profile.html', {
        name: user.name,
        imgURL: user.imgURL
    })
}

async function settings_page(req,res){
	console.log("User Settings accessed");
	let email = req.cookies['user']
	const user = await User.findOne({
		where: { email: email,role:UserRole.User }
	})
	return res.render('user/settings.html', {
		name: user.name,
		imgURL: user.imgURL
	})
};

async function logout_page(req,res) {
    console.log("User Logout accessed");
	req.logout();
	req.flash('success_msg', 'You are logged out from user')
	return res.redirect('/')
}

async function watchLive_page(req,res) {
    console.log("Watch Livestream accessed");
    return res.redirect('../livestream/watch')
}