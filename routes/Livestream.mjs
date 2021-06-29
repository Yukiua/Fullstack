import moment from 'moment';
import Livestream from '../models/Livestream';
import router from './main.mjs';


//router.post('/createLivestream', (req, res) => {
//    let title = req.body.title;
//    let info = req.body.info.slice(0,999);
//    let dateLivestream = moment(req.body.dateLivestream, 'DD/MM/YYYY');

//    Livestream.create({
//        title : title,
//        info : info,
//        dateLivestream : dateLivestream
//    }) .then((livestream) => {
//        res.redirect('/livestream/listLivestream');
//    })
//    .catch (err => console.log(err))
//});

// router.get('/listLivestream',(req,res) => {
//     Livestream.findAll({
//         where:{
//             userId: req.user.id
//         },
//         order : [
//             ['title', 'ASC']
//         ],
//         raw: true
//     })
//     .then((livestreams) => {
//         res.render('/listLivestream', {
//             livestreams : livestreams
//         });
//     })
//     .catch(err => console.log(err));
// })

