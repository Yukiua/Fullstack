import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import moment from 'moment';
import Livestream from '../models/Livestream.js';
import CookieParser from 'cookie-parser';

router.get("/livestream", lstable);
router.get("/livestream-data", ls_data);

router.get('/listLivestream',(req,res) => {
    console.log("list livestream page accessed");
    return res.render('listLivestream.html')
})

router.post('/createLivestream', async function(req, res){
    try{
        const livestream = await Livestream.create({
            title : req.body.title,
            info : req.body.info,
            dateLivestream : req.body.dateLivestream
        });
        res.cookie('livestream', livestream.id, {maxAge:99999, httpOnly:true});
    }
    catch{
        console.error("error");
    }
    return res.redirect('listLivestream')
}) 
       

async function update_livestream(req,res){
    try{
        const livestream = await Livestream.findOne({
            where: {"id": req.params["id"]}
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
    return res.render("listLivestream.html");
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