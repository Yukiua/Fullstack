import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import User, { UserRole } from '../../models/User.js';
import { ensureAuthenticatedCustomer } from '../../config/authenticate.js';
import SettingsOptions from './settings.mjs'
import Livestream from '../../models/Livestream.js';
router.use("/settings", SettingsOptions)

router.get("/profile", ensureAuthenticatedCustomer, user_profile);
router.get("/watchLivestream", ensureAuthenticatedCustomer, watchLive_page);
router.get("/logout", ensureAuthenticatedCustomer, logout_page);
router.get("/settings", ensureAuthenticatedCustomer, settings_page);
router.get("/tickets", ensureAuthenticatedCustomer, tickets_page);
router.get("/tickets-data", ensureAuthenticatedCustomer, tickets_data);

async function user_profile(req,res) {
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
    console.log("User profile page accessed");
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email: email, role:UserRole.User }
    })
    return res.render('user/profile.html', {
        name: user.name,
        imgURL: user.imgURL,
        user: userV
    })
}

async function settings_page(req,res){
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
	console.log("User Settings accessed");
	let email = req.cookies['user'][0]
	const user = await User.findOne({
		where: { email: email,role:UserRole.User }
	})
	return res.render('user/settings.html', {
		name: user.name,
		imgURL: user.imgURL,
        user: userV
	})
};

async function logout_page(req,res) {
    console.log("User Logout accessed");
	req.logout();
	req.flash('success_msg', 'You are logged out from user')
	return res.redirect('/')
};

async function watchLive_page(req,res) {
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
    console.log("Watch Livestream accessed");
    const user = await User.findOne({
        where: { email : email, role:UserRole.User }
    })
    return res.redirect('../livestream/watch.html', {
        uuid: user.uuid,
        user: userV
    })
};

async function retrieve_stream(){
    const livestream = await Livestream.findAll();
    return livestream;
}

async function tickets_data(req,res){
    const livestreams = await Livestream.findAll({raw: true});
    return res.json({
        "total": livestreams.length,
        "rows": livestreams
    });
}
async function tickets_page(req,res) {
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email : email, role:UserRole.User }
    })
    const livestreams = await Livestream.findAll({raw: true});
    console.log("tickets page accessed");
    return res.render("user/tickets.html",{
        user:userV
    })
}