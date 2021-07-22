import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Concert from '../models/Concert.js';
import CookieParser    from 'cookie-parser';

router.get("/concertList", cltable);
router.get("/concerts", catable);
router.get("/table-data", table_data);

// router.get("/concerts", view_concerts)
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
            time: req.body.time,
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
    try{
        const concert = await Concert.findOne({
            where: {id: req.params("id")}
        })
        if (concert){
            if (req.body.title == '') {
                req.body.title = concert.title
            }
            if (req.body.details == '') {
                req.body.title = concert.details
            }
            if (req.body.genre == '') {
                req.body.title = concert.genre
            }
            if (req.body.date == '') {
                req.body.title = concert.date
            }
            if (req.body.time == '') {
                req.body.title = concert.time
            }
            if (req.body.tickets == '') {
                req.body.title = concert.tickets
            }
        }
    }
    catch{
        console.error("error in try page");
    }
    return res.render('concert/updateConcert.html', { id: req.params.id})
})

router.post("/updateConcert/:id", async function(req, res){
    console.log("Updating");
    try{
        console.log(req.params.id)
        console.log("try to grab id");
        const concert = await Concert.findOne({
            where: {id: req.params.id}
        });
        console.log("grabbed id");
        if (concert){
            Concert.update({
                title : req.body.title,
                details : req.body.details,
                genre : req.body.genre,
                date : req.body.date,
                time: req.body.time,
                tickets : req.body.tickets
            })
            return res.redirect("/concert/concerts")
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

// Update function
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

// concerts table
async function cltable(req, res){
    return res.render("concert/concertList.html");
}

async function catable(req, res){
    return res.render("concert/concerts.html");
}

async function table_data(req, res){
    const concerts = await Concert.findAll({raw: true});
    return res.json({
        "total": concerts.length,
        "rows": concerts
    })
}

