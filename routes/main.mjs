import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import moment from 'moment';
import Livestream from '../models/Livestream.js';
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
//import Livestream from '../models/Livestream';
//router.use("/addLivestream", addLivestream);

import Performer from './Performer.mjs'
router.use("/performer", Performer);

import donation from './donation.mjs'
router.use("/donation", donation);


// ---------------- 
//	TODO:	Common URL paths here
router.get("/",      async function(req, res) {
	console.log("Home page accessed");
	return res.render('index.html')});

//Concert, cart, payment test
router.get("/concertList", async function(req, res){
	console.log("concertLists accessed");
	return res.render('concertList.html')
});

router.get("/concerts", async function(req, res){
	console.log("Concerts accessed");
	return res.render('concerts.html')
});

router.get("/concertDetails", async function(req, res){
	console.log("concertDetails accessed");
	return res.render('concertDetails.html')
});

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