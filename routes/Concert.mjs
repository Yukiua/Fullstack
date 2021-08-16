import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Concert from '../models/Concert.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import Livestream from '../models/Livestream.js';
import Ticket from '../models/Ticket.js';
import CookieParser    from 'cookie-parser';

//Create Concert page
router.get("/createConcert", async function(req, res){
	console.log("createConcert accessed");
	return res.render('concert/createConcert.html');
})

//user side concert page
router.get("/concertList", async function(req, res){
	console.log("concertLists accessed");
	return res.render('concert/concertList.html');
});

//admin side concert page
router.get("/concerts", async function(req, res){
	console.log("Concerts accessed");
	return res.render('concert/concerts.html');
});

//Cart page
router.get("/cart", async function(req, res){
	console.log("Cart accessed");
	return res.render('concert/cart.html');
});

//Payment Page
router.get("/payment", async function(req, res){
	console.log("Payment accessed");
    //const user = await User.findOne({where: userloggedin})
	return res.render('concert/payment.html'
    // ,
    // { name: User.name,
    // email: User.email
    // }
    )
});

//Add to Ticket model
router.post("/payment", async function(req, res){
    console.log("Trying to create Ticket");
    try{
        const ticket = await Ticket.create({
            userID: User.uuid,
            concertID: Concert.id,
            livestreamID: Livestream.uuid
        });
    }
    catch{
        console.error("Error in creating Ticket")
        return res.redirect('/concert/payment')
    }
    return res.redirect('/user/tickets')
});

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
    bticket: concert.bticket
    })
});

//Add to Cart from Concert Details
router.post("/concertDetails/:id", async function(req, res){
    console.log("Trying to add to cart");
    try{
        const concert = await Concert.findOne({
            where: {id: req.params.id}
        });
        if (req.body.bticket == 1){
            const cart = await Cart.create({
                id: concert.id,
                title: concert.title,
                price: 100,
                ticket: "Bundle Ticket"
            });
        }
        else{
            const cart = await Cart.create({
                id: concert.id,
                title: concert.title,
                price: 20,
                ticket: "Normal Ticket"
            });
        }
    }
    catch{
        console.error("error in trying to add to cart");
        return res.redirect('/concert/concertlist')
    }
    console.log("Added to Cart")
    return res.redirect('/concert/concertlist');
});

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
			bticket: req.body.bticket
		});
		res.cookie('concert', concert.id, {maxAge: 900000, httpOnly: true});
        console.log("Concert created");
	}
	catch{
		console.error("error in createConcert");
        return res.redirect('/concert/createConcert');
	}
	return res.redirect('/concert/concerts');
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
    bticket: concert.bticket
    });
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
                bticket : req.body.bticket
            },
            {
            where: {id: req.params.id}
            })
            return res.redirect("/concert/concerts")
            }
        }
    catch{
        console.error("error in updateConcert");
        return res.redirect("concert/updateConcert")
    }
});

//Delete Concert
router.post("/concerts/:id", async function(req, res){
    console.log("Trying to delete concert")
    try{
        console.log("try to grab id");
        const concert = await Concert.findOne({
            where: {id: req.params.id}
        });
        if (concert !== undefined){
            concert.destroy()
            console.log("Concert Deleted")
            return res.redirect("/concert/concerts")
        }
    }
    catch{
        console.error("error in deleting concert");
    }
});

//Delete Cart
router.post("/cart/:id", async function(req, res){
    console.log("Trying to delete cart")
    try{
        console.log("try to grab id");
        const cart = await Cart.findOne({
            where: {id: req.params.id}
        });
        if (cart !== undefined){
            cart.destroy()
            console.log("Cart Deleted")
            return res.redirect("/concert/cart")
        }
    }
    catch{
        console.error("error in deleting concert");
    }
});

// concerts table
router.get("/concertList", cltable);
router.get("/concerts", ctable);
router.get("cart", catable);
router.get("/concert-data", concert_data);
router.get("/cart-data", cart_data);

async function cltable(req, res){
    return res.render("concert/concertList.html");
}

async function ctable(req, res){
    return res.render("concert/concerts.html");
}

async function catable(req, res){
    return res.render("concert/cart.html");
}

async function concert_data(req, res){
    const concerts = await Concert.findAll({raw: true});
    return res.json({
        "total": concerts.length,
        "rows": concerts
    });
}

async function cart_data(req, res){
    const cart = await Cart.findAll({raw: true});
    return res.json({
        "total": cart.length,
        "rows": cart
    });
}