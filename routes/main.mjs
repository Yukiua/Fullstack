import route from 'express';
const { Router } = route;
const router = Router();
export default router;

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

import user from './user/user.mjs'
router.use("/user", user)

import admin from './admin/admin.mjs';
router.use("/admin", admin)

import stream from './stream.mjs'
router.use("/stream", stream)

// ---------------- 
//	TODO:	Common URL paths here
router.get("/",      async function(req, res) {
	let performerV = false
	if(req.cookies['performer'] !== undefined && req.cookies['performer'][1] == true){
		performerV = true;
	}
	let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
	console.log(req.cookies)
	console.log("Home page accessed");
	return res.render('index.html',{
		performer:performerV,
		user:userV
	})
});