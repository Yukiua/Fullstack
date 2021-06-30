import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Performer from '../models/Performer.js';


router.get("/login",async function(req, res) {
	console.log("Performer Login page accessed");
	return res.render('auth/performer/login.html');
});

router.get("/signup", async function(req, res) {
	console.log("Performer SignUp page accessed");
	return res.render('auth/performer/signup.html');
});

router.post("/signup", (req,res) =>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    Performer.create({
        name:name,
        email:email,
        password:password,
    }).then(() => {
        res.redirect('/dashboard')
    })
    .catch (err => console.log(err))
})

router.get("/dashboard", async function(req,res){
	console.log("Performer Dashboard accessed");
	return res.render('performer/dashboard.html')
});
router.get("/analytics", async function(req,res){
	console.log("Performer Analytics accessed");
	return res.render('performer/analytics.html',{
		author: "The awesome programmer",
		// donations
		values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
		// total watch views
		secondvalues : [1921, 1982, 1934, 1954, 1025, 1205, 1680, 1666, 1689, 1999, 1578, 1255], 
		// total watch per hour
		thirdvalues : [105,163,176,126,159,158,162,199,103,103,108,104] 
	});
});
router.get("/settings", async function(req,res){
	console.log("Performer Settings accessed");
	return res.render('performer/settings.html')
});
router.get("/logout", async function(req,res){
	console.log("Performer Logout accessed");
	return res.render('performer/logout.html')
});


router.get("/createLivestream", async function(req,res){
    console.log("Create Livestream accessed, passing over");
    return res.redirect('../createLivestream')
})
