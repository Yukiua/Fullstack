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
router.get("/tickets", ensureAuthenticatedCustomer, tickets_page)

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

async function fetch_streams(){
    const livestream = await Livestream.findAll();
    return livestream;
}

async function tickets_page(req,res) {
    let livestream = await fetch_streams();
    let livestreams = [];
    let livestreamNo = 0;
    for(var i=0; i<livestream.length; i++){
        livestreamNo = livestreamNo + 1;
        livestreams.push({
            "livestreamNo":livestreamNo,
            "title" : livestream[i].dataValues.title,
			"info" : livestream[i].dataValues.info,
			"dateLivestream" : livestream[i].dataValues.dateLivestream
        })
    }
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
    const user = await User.findOne({
        where: { email : email, role:UserRole.User }
    })
    console.log("tickets page accessed");
    return res.render
}