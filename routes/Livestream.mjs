import moment from 'moment';
import Livestream from '../models/Livestream.js';
import router from './main.mjs';

router.get("/table", table);
router.get("/table-data", table_data);

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

async function table(req, res){
    return res.render("listLivestream");
}

async function table_data(req, res){
    const filter = JSON.parse(req.query.filter);
    console.log(filter);
    const condition = {
        "livestreamName": {[Op.substring]: filter.livestreamName},
        "livestreamInfo": {[Op.substring]: filter.livestreamInfo}
    }
    const total = await ModelLivestream.count({
        where: condition
    });
    const livestreams = await ModelLivestream.count({
        where: condition,
        order: (req.query.sort) ? [[req.query.sort, req.query.order]] : undefined,
        limit: parseInt(req.query.limit),
        offset: parseInt(req.query.offset),
        raw: true
    });
    return res.json({
        "total": total,
        "rows": livestreams
    });
}

await user.destroy();

const deleted = await ModelLivestream.destroy({
    where: {
        
    }
});