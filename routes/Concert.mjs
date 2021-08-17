import route from 'express';
const { Router } = route;
const router = Router();
export default router;
import Concert from '../models/Concert.js';
import Cart from '../models/Cart.js';
import User, { UserRole } from '../models/User.js';
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
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
	console.log("concertLists accessed");
	return res.render('concert/concertList.html',{
        user:userV
    });
});

//admin side concert page
router.get("/concerts", async function(req, res){
	console.log("Concerts accessed");
	return res.render('concert/concerts.html');
});

//Cart page
router.get("/cart", async function(req, res){
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
	console.log("Cart accessed");
	return res.render('concert/cart.html',{
        user:userV
    });
});

//Payment Page
router.get("/payment", async function(req, res){
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
    const cart = await Cart.findAll({raw: true})
    if (cart.length == 0){
        req.flash('error_msg', 'Cart is empty.')
        return res.redirect('cart')
    }
	console.log("Payment accessed");
	let email = req.cookies['user'][0]
	const user = await User.findOne({
	    where: { email: email, role: UserRole.User}
	});
	return res.render('concert/payment.html',
	{ name: user.name,
	email: user.email
    });
});

//Add to Ticket model
router.post("/payment", async function(req, res){
    console.log("Trying to create Ticket");
    try{
        const cart = await Cart.findAll({raw: true})
        let email = req.cookies['user'][0]
        const user = await User.findOne({
            where: { email: email, role: UserRole.User}
        })
        for (x in cart){
            const ticket = await Ticket.create({
                userID: user.uuid,
                concertID: cart.id,
            });
        }
    }
    catch(error){
        console.log(error)
        console.error("Error in creating Ticket")
        req.flash('error_msg', 'Payment was unsuccessful.')
        return res.redirect('/concert/payment')
    }
    return res.redirect('/user/tickets')
});

//View Concert Details
router.get("/concertDetails/:id", async function(req, res){
    let userV = false
    if(req.cookies['user'] !== undefined && req.cookies['user'][1] == true){
		userV = true;
	}
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
    bticket: concert.bticket,
    ntp: concert.ntp,
    btp: concert.btp,
    user:userV
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
                price: concert.btp,
                ticket: "Bundle Ticket",
            });
        }
        else{
            const cart = await Cart.create({
                id: concert.id,
                title: concert.title,
                price: concert.ntp,
                ticket: "Normal Ticket",
            });
        }
    }
    catch{
        console.error("error in trying to add to cart");
        req.flash('error_msg', 'Concert Ticket already in Cart.')
        return res.redirect('/concert/concertlist')
    }
    console.log("Added to Cart")
    req.flash('success_msg', 'Added to cart.')
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
			bticket: req.body.bticket,
            ntp: req.body.ntp,
            btp: req.body.btp,
		});
        console.log("Concert created");
	}
	catch{
		console.error("error in createConcert");
        req.flash('error_msg', 'Failed to create concert.')
        return res.redirect('/concert/createConcert');
	}
    req.flash('success_msg', 'Created concert.')
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
    bticket: concert.bticket,
    ntp: concert.ntp,
    btp: concert.btp,
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
            req.flash('success_msg', 'Updated concert.')
            return res.redirect("/concert/concerts")
            }
        }
    catch{
        console.error("error in updateConcert");
        req.flash('error_msg', 'Failed to update concert.')
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
            req.flash('success_msg', 'Deleted concert.')
            return res.redirect("/concert/concerts")
        }
    }
    catch{
        console.error("error in deleting concert");
        req.flash('error_msg', 'Failed to delete concert.')
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
            req.flash('success_msg', 'Removed item from cart.')
            return res.redirect("/concert/cart")
        }
    }
    catch{
        console.error("error in deleting concert");
        req.flash('error_msg', 'Failed to delete from cart.')
    }
});

// concerts table
router.get("/concertList", cltable);
router.get("/concerts", ctable);
router.get("/cart", catable);
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
