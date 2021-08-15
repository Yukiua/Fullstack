import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import moment from 'moment';
import Livestream from '../models/Livestream.js';
import { ensureAuthenticated } from '../config/authenticate.js';
import CookieParser from 'cookie-parser';

router.get("/livestream", lstable);
router.get("/livestream-data", ls_data);
router.get("/create", ensureAuthenticated, create_ls_page)
router.post("/create", ensureAuthenticated, create_ls_process)
router.get("/golive", ensureAuthenticated, goLive_page)


async function create_ls_page(req,res){
	console.log("Create Livestream Page accessed");
	return res.render('livestream/create.html')
}

async function create_ls_process(req,res){
    console.log("livestream contents received");
    console.log(req.body);
    try{
        const livestream = await Livestream.create({
            performer_id : req.user.uuid,
            title : req.body.title,
            info : req.body.info,
            dateLivestream : req.body.dateLivestream,
            performer: req.user.email
        });
        res.cookie('livestream', livestream.uuid, {maxAge:99999, httpOnly:true});
    }
    catch{
        console.error("error");
    }
    return res.redirect('../performer/dashboard')
}


router.get('/list',(req,res) => {
    console.log("list livestream page accessed");
    return res.render('livestream/list.html')
});

async function update_livestream(req,res){
    try{
        const livestream = await Livestream.findOne({
            where: {"streamId": req.params["streamId"]}
        });
    if (livestream){
        return res.render("updateLivestream", {livestream : livestream})
        }
    }
    catch{
        console.error("error");
    }
}

async function lstable(req, res){
    return res.render("livestream/list.html");
}

async function ls_data(req, res){
    const livestreams = await Livestream.count({raw:true});
    return res.json({
        "total": livestreams.length,
        "rows": livestreams
    })
}

async function goLive_page (req,res){
	console.log("go live page accessed");
    let email = req.cookies['performer'][0]
    const livestream = await Livestream.findOne({
        where: { performer: email}
    })
	return res.render('livestream/golive.html', {
        streamId: livestream.uuid,
    })
}
