import route from 'express';
const { Router } = route;
const router = Router();
export default router;

import User, { UserRole } from '../../models/User.js';
import flashMessage from '../../utils/messenger.js';
import passport from 'passport';
import Hash from 'hash.js';
import nunjucks from 'nunjucks';
import { ensureAuthenticatedAdmin } from '../../config/authenticate.js';
import JWT from 'jsonwebtoken';
import e from 'express';
import { UploadTo, DeleteFile, DeleteFolder } from '../../utils/multer.mjs'
import Faq from '../../models/Faq.js';

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/createfaq", createfaq);
router.post("/createfaqprocess", createfaq_process);
router.get("/deletefaqbyadmin/:id", deletefaq);
router.get('/updatefaq/:id', updatefaq_page);
router.get("/listfaq", listfaq);
router.get("/showfaqs", showfaqs);
router.post("/updatefaq/updatefaqbyadmin", updatefaq_process);

async function showfaqs(req , res) {
    console.log("show faqs page is accessed by users");
    const faq = await fetchFaqs();
    let faqs = []
    for(var i = 0; i < faq.length; i++) {
        faqs.push({
            "question": faq[i].dataValues.question,
            "answer": faq[i].dataValues.answer
        })
    }
    return res.render("faq.html", {
        faqs : faqs ,
        count : faqs.length,
        imgURL: 'public/img/default.png'
    });
}

async function updatefaq_process(req , res) {
    console.log("update faq process page is accessed by admin");
    console.log("req body ", req.body);
    let uuid = req.body.id;
    console.log("uuid ---> ", uuid);
    const faq = await Faq.findOne({
        where: { uuid: uuid }
    })
    console.log("faq ----------> ", faq);
    if(faq) {
        try {
            if (req.body.question == '') {
                req.body.question = faq.question
            }
            if (req.body.answer == '') {
                req.body.answer = faq.answer
            }
            await Faq.update({
                question: req.body.question,
                answer: req.body.answer
            }, {
                where: {
                    uuid: uuid
                }
            })
            flashMessage(res, 'success', 'Faq is successfully updated by admin.', 'fas fa-sign-in-alt', true);
            res.cookie('admin',  "admin", { maxAge: 900000, httpOnly: true });
            req.flash('success_msg', 'Faq is successfully updated by Admin');
            console.log("Faq is successfully " , faq.uuid)
            return res.redirect("../listfaq");
        }
        catch (error) {
            //	Else internal server error
            console.error(`Failed to update user: ${req.body.email} `);
            console.error(error);
            req.flash('error_msg', 'Something wrong happed within the server.');
            return res.redirect("../profile");
        }
    }
}

async function updatefaq_page(req , res) {
    console.log("update faq page is accessed by admin");
    console.log("req id ", req.params.id);
    const faq = await Faq.findOne({
		where : { uuid : req.params.id }
	});
    if(faq) {   
        return res.render('admin/faq/updateFaq.html', {
			question: faq.question,
        	answer: faq.answer,
            id:faq.uuid,
			updateBy : "admin"
			});        
    } else {
        flashMessage(res, 'failure', 'There is no faqs', 'fas fa-sign-in-alt', true);
		req.flash('error_msg', 'There is no faqs');
        res.render("admin/manageFaq.html")
    }
    
}

async function listfaq(req , res) {
    console.log("list faq page is accessed by admin");

    let faq = await fetchFaqs();
    let faqs = [];
	let sno = 0;
	for(var i=0;i < faq.length ; i ++) {
		sno = sno + 1;
		faqs.push({
				"sno": sno,
				"question" : faq[i].dataValues.question,
				"answer" : faq[i].dataValues.answer,
				"id" : faq[i].dataValues.uuid
		})
	}
    console.log("faq ----> ", faqs);
    res.render("admin/faq/listFaq.html", {
        count: faq.length,
        faqs: faqs,
        imgURL: 'public/img/default.png'
    });
}

async function fetchFaqs() {
    const faq = await Faq.findAll();
    return faq;
}

async function createfaq(req , res) {
    console.log("create faq page is accessed by admin");
    res.render("admin/faq/createFaq.html",{		imgURL: 'public/img/default.png'
});
}

async function createfaq_process(req , res)  {
    console.log("create faq process is accessed by admin")
    try {
        const faq = await Faq.create({
            question: req.body.question,
            answer: req.body.answer
    
        });
        flashMessage(res, 'success', 'Successfully created an question.', 'fas fa-sign-in-alt', true);
        req.flash('success_msg', 'Question created successfully');
        return res.redirect("listfaq");
    }
    catch (error) {
        //	Else internal server error
        console.error(`Failed to create a new question: ${req.body.email} `);
        console.error(error); role9
        req.flash('error_msg', 'Something wrong happed within the server.');
            return res.render('createfaq')
        }
}

async function deletefaq(req, res) {
    console.log("delete faq page is accessed by admin");
	//let email = req.cookies['user'][0];
	console.log("req.body.uuid", req.params.id);
	//console.log("email ---> ", email);
	const faq = await Faq.findOne({
		where : { uuid : req.params.id }
	});
	// res.cookie('uuid',  [req.params.id , true], { maxAge: 900000, httpOnly: true });
	// res.cookie('admin',  "admin", { maxAge: 900000, httpOnly: true });
    
    // if(user.imgURL != "public/img/default.png"){
    //     console.log(`Deleting ${user.uuid}'s picture`)
    //     DeleteFolder(`public/img/uploads/${user.uuid}`);
    // }

    console.log(`Deleting ${faq.question}`)
    if(faq !== undefined){
        faq.destroy();
	}
    // res.clearCookie("faq");
    console.log("Faq deleted")
    req.flash('success_msg', 'Faq successfully deleted');
    return res.redirect('../listfaq')
}
