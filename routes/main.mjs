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



// ---------------- 
//	TODO:	Common URL paths here
router.get("/",      async function(req, res) {
	console.log("Home page accessed");
	return res.render('index.html')});

router.get("/performer_dashboard", async function(req,res){
	console.log("Performer Dashboard accessed");
	return res.render('performer_dashboard.html')
});
router.get("/performer_analytics", async function(req,res){
	console.log("Performer Analytics accessed");
	return res.render('performer_analytics.html',{
		author: "The awesome programmer",
		// donations
		values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
		// total watch views
		secondvalues : [1921, 1982, 1934, 1954, 1025, 1205, 1680, 1666, 1689, 1999, 1578, 1255], 
		// total watch per hour
		thirdvalues : [105,163,176,126,159,158,162,199,103,103,108,104] 
	});
});
router.get("/performer_settings", async function(req,res){
	console.log("Performer Settings accessed");
	return res.render('performer_settings.html')
});
router.get("/performer_logout", async function(req,res){
	console.log("Performer Logout accessed");
	return res.render('performer_logout.html')
});


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
})

router.get("/createLivestream", async function(req,res){
	console.log("Create Livestream Page accessed");
	return res.render('createLivestream.html')
})

router.get("/listLivestream", async function(req,res){
	console.log("List Livestream Page accessed");
	return res.render('listLivestream.html')
})

router.get('/listLivestream',(req,res) => {
    Livestream.findAll({
        where:{
            userId: req.user.id
        },
        order : [
            ['title', 'ASC']
        ],
        raw: true
    })
    .then((livestreams) => {
        res.render('livestream/listLivestream', {
            livestreams : livestreams
        });
    })
    .catch(err => console.log(err));
})

router.post('/createLivestream', (req, res) => {
    let title = req.body.title;
    let info = req.body.info.slice(0,999);
    let dateLivestream = req.body.dateLivestream;

    Livestream.create({
        title : title,
        info : info,
        dateLivestream : dateLivestream
    }) .then((livestream) => {
        res.redirect('/livestream/listLivestream');
    })
    .catch (err => console.log(err))
});