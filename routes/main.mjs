import route from 'express';
const { Router } = route;
const router = Router();
export default router;
<<<<<<< HEAD
import User, { UserRole } from '../models/User.js';
=======
import moment from 'moment';
import Livestream from '../models/Livestream.js';
>>>>>>> dacf85b1beb24aafe212d865e4bc741bfa38ce33
import Concert from '../models/Concert.js';

//import addLivestream from './Livestream.mjs';

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path", async function (req, res) {	
	return res.sendFile(`./dynamic/${req.params.path}`)
});

// ---------------- 
//	TODO: Attach additional routers here
import auth from './auth.mjs'
router.use("/auth", auth);

import performer from './performer/performer.mjs'
router.use("/performer", performer);

import donation from './donation.mjs'
router.use("/donation", donation);

import concert from './Concert.mjs'
router.use("/concert", concert)

import livestream from './livestream.mjs'
router.use("/livestream", livestream);

import user from './user.mjs'
router.use("/user", user)

import admin from './admin/admin.mjs';
router.use("/admin", admin)

import stream from './stream.mjs'
router.use("/stream", stream)

// ---------------- 
//	TODO:	Common URL paths here
router.get("/",      async function(req, res) {
	console.log(req.cookies)
	console.log("Home page accessed");
	return res.render('index.html',)
});

router.get("/cart", async function(req, res){
	console.log("Cart accessed");
	return res.render('cart.html')
});

