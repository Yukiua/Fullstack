import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Concert from '../models/Concert.js';
import CookieParser    from 'cookie-parser';

router.get("/concertList", table);
router.get("/table-data", table_data);

router.get("/concerts", view_concerts)
router.get("/createConcert", async function(req, res){
	console.log("createConcert accessed")
	return res.render('concert/createConcert.html')
})

router.post("/createConcert", async function(req, res){
	console.log("Concert created")
	try{
		const concert = await Concert.create({
			title: req.body.title,
			details: req.body.details,
			genre: req.body.genre,
			date: req.body.date,
			tickets: req.body.tickets
		});
		res.cookie('concert', concert.id, {maxAge: 900000, httpOnly: true});
	}
	catch{
		console.error("error");
	}
	
	return res.redirect('/concert/concerts')
})

router.get("/concertList", async function(req, res){
	console.log("concertLists accessed");
	return res.render('concert/concertList.html')
});

router.get("/concerts", async function(req, res){
	console.log("Concerts accessed");
	return res.render('concert/concerts.html')
});

router.get("/updateConcert/:id", async function(req, res){
    console.log("Update Concert accessed");
    return res.render('concert/updateConcert.html')
})

router.post("/updateConcert/:id", async function(req, res){
    console.log("Updating");
    try{
        const concert = await Concert.findOne({
            where: {id: req.params("id")}
        });
        if (concert){
            Concert.update({
                title : req.body.title,
                details : req.body.details,
                genre : req.body.genre,
                date : req.body.date,
                tickets : req.body.tickets
            })
            return res.render("/concert/updateConcert.html", {concert : concert})
            }
        }
    catch{
        console.error("error");
    }
})

router.get("/concertDetails", async function(req, res){
	console.log("concertDetails accessed");
	return res.render('concert/concertDetails.html')
});

// concerts table
async function view_concerts(req, res){
    console.log("Function werking");
    let concertID = req.cookies['concert']
    const concert = await Concert.findAll();
    res.cookie('concert', concert.id, { maxAge: 900000, httpOnly: true });
    return res.render('concert/concerts.html', {concert : concert})
}

async function table(req, res){
    return res.render("concert/concertList.html");
}

async function table_data(req, res){
    const concerts = await Concert.findAll({raw: true});
    return res.json({
        "total": concerts.length,
        "rows": concerts
    })
}

async function update_concert(req, res){
    console.log("Grabbed")
    try{
        const concert = await Concert.findOne({
            where: {"id": req.params["id"]}
        });
    if (concert){
        return res.render("concert/updateConcert", {concert : concert})
        }
    }
    catch{
        console.error("error");
    }    
}