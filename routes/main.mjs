import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import User from '../models/User.js';
import Performer from '../models/Performer.js';
import moment from 'moment';
import Livestream from '../models/Livestream.js';
import Concert from '../models/Concert.js';

//import addLivestream from './Livestream.mjs';

// ---------------- 
//	Serves dynamic files from the dynamic folder
router.get("/dynamic/:path", async function (req, res) {	
	return res.sendFile(`./dynamic/${req.params.path}`)
});

// ---------------- 
//	TODO: Attach additional routers here
import RouterAuth from './auth.mjs'
router.use("/auth", RouterAuth);

import performer from './Performer.mjs'
router.use("/performer", performer);

import donation from './donation.mjs'
router.use("/donation", donation);

import concert from './Concert.mjs'
router.use("/concert", concert)

//import livestream from './Livestream.mjs'
//router.use("/livestream", livestream);

// ---------------- 
//	TODO:	Common URL paths here
router.get("/",      async function(req, res) {
	if(req.cookies['deleteperformer'] !== undefined){
		Performer.destroy({
			where: {
				email: req.cookies['deleteperformer']
			}
		})
		User.destroy({
			where: {
				email: req.cookies['deleteperformer']
			}
		})
		res.clearCookie("deleteperformer");
	}
	console.log("Home page accessed");
	return res.render('index.html')});

router.get("/cart", async function(req, res){
	console.log("Cart accessed");
	return res.render('cart.html')
});

router.get("/donation", async function(req,res){
	console.log("Donation page accessed");
	return res.render('donation.html')
});

router.get("/createLivestream", async function(req,res){
	console.log("Create Livestream Page accessed");
	return res.render('createLivestream.html')
});

router.get("/listLivestream", async function(req,res){
	console.log("List Livestream Page accessed");
	return res.render('listLivestream.html')
});

router.get("/invoice", async function(req,res){
	console.log("Invoice page accessed");
	return res.render('invoice.html')
})