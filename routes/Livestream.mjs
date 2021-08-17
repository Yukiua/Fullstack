import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import moment from 'moment';
import Livestream from '../models/Livestream.js';
import Concert from '../models/Concert.js';
import { ensureAuthenticated } from '../config/authenticate.js';
import CookieParser from 'cookie-parser';

router.get("/livestream", lstable);
router.get("/livestream-data", ls_data);
router.get("/create", ensureAuthenticated, create_ls_page)
router.post("/create", ensureAuthenticated, create_ls_process)
router.get("/golive", ensureAuthenticated, goLive_page)
router.get("/delete", ensureAuthenticated, delete_page)
router.post("/delete", ensureAuthenticated, delete_process)


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
            performer: req.user.email,
            code: req.body.code
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
    return res.render("../user/tickets.html");
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
        streamId: livestream.uuid
    })
}

async function delete_page (req,res){
    console.log("delete livestream page accessed");
    let email = req.cookies['performer'][0]
    const livestream = await Livestream.findOne({
        where: {performer: email}
    })
    return res.render('livestream/delete.html',{
        streamId: livestream.uuid
    })
}

async function delete_process (req,res){
    console.log("deleting livestream");
    let email = req.cookies['performer'][0]
    const livestream = await Livestream.findOne({
        where: {performer: email}
    })
    if (livestream !== undefined){
        livestream.destroy()
    }
    console.log("livestream deleted")
    req.flash('success_msg', 'livestream successfully deleted');
    return res.redirect('../')
}