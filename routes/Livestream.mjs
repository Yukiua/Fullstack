import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import moment from 'moment';
import Livestream from '../models/Livestream.js';
import CookieParser from 'cookie-parser';

router.get("/livestream", lstable);
router.get("/livestream-data", ls_data);
router.get("/create", create_ls_page)
router.post("/create", create_ls_process)

async function create_ls_page(req,res){
	console.log("Create Livestream Page accessed");
	return res.render('livestream/create.html')
}

async function create_ls_process(req,res){
    try{
        const livestream = await Livestream.create({
            performer_id : req.user.uuid,
            title : req.body.title,
            info : req.body.info,
            dateLivestream : req.body.dateLivestream
        });
        res.cookie('livestream', livestream.streamId, {maxAge:99999, httpOnly:true});
    }
    catch{
        console.error("error");
    }
    return res.redirect('/')
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

// await user.destroy();

// const deleted = await ModelLivestream.destroy({
//     where: {
        
//     }
// });