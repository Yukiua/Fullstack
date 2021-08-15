import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Concert from '../models/Concert.js';
import Cart from '../models/Cart.js';
import CookieParser    from 'cookie-parser';

// Page renders
router.get("/createConcert", async function(req, res){
	console.log("createConcert accessed")
	return res.render('concert/createConcert.html')
})

//user side concert page
router.get("/concertList", async function(req, res){
	console.log("concertLists accessed");
	return res.render('concert/concertList.html')
});

//admin side concert page
router.get("/concerts", async function(req, res){
	console.log("Concerts accessed");
	return res.render('concert/concerts.html')
});

// router.get("/concertDetails", async function(req, res){
// 	console.log("concertDetails accessed");
// 	return res.render('concert/concertDetails.html')
// });

//View Concert Details
router.get("/concertDetails/:id", async function(req, res){
    console.log("Concert Details page accessed");
    const concert = await Concert.findOne({
        where: {id: req.params.id}
    });
    return res.render('concert/concertDetails.html',
    { id: req.params.id,
    title: concert.title,
    details: concert.details,
    genre: concert.genre,
    date: concert.date,
    time: concert.time,
    tickets: concert.tickets
    })
});

//Add to Cart from Concert Details
router.post("/concertDetails/:id", async function(req, res){
    console.log("Trying to add to cart");
    try{
        const concert = await Concert.findOne({
            where: {id: req.params.id}
        });
        const cart = await Cart.create({
            title: concert.title
        });
    }
    catch{
        console.error("error in trying to add to cart");
    }
})

//Create Concert
router.post("/createConcert", async function(req, res){
	console.log("Trying to create concert");
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
        console.log("Concert created")
	}
	catch{
		console.error("error in createConcert");
	}
	return res.redirect('/concert/concerts')
});

//Update Concert
router.get("/updateConcert/:id", async function(req, res){
    console.log("Update Concert accessed");
    const concert = await Concert.findOne({
        where: {id: req.params.id}
    });
    return res.render('concert/updateConcert.html',
    { id: req.params.id,
    title: concert.title,
    details: concert.details,
    genre: concert.genre,
    date: concert.date,
    time: concert.time,
    tickets: concert.tickets
    })
});

router.post("/updateConcert/:id", async function(req, res){
    console.log("Updating");
    try{
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
            },
            {
            where: {id: req.params.id}
            })
            return res.redirect("/concert/concerts")
            }
        }
    catch{
        console.error("error in updateConcert");
    }
});

//Delete Concert
router.get("concerts/deleteconcert/:id", async function(req, res){
    console.log("Trying to delete concert")
    try{
        console.log("try to grab id");
        const concert = await Concert.findOne({
            where: {id: req.params.id}
        });
    }
    catch{
        console.error("error in deleting concert");
    }
});

// concerts table
router.get("/concertList", cltable);
router.get("/concerts", catable);
router.get("/table-data", table_data);

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
    });
}

