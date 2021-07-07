import route from 'express';
const { Router } = route
const router = Router();
export default router;
import Performer from '../models/Performer.js';
import User from '../models/User.js';
import { ensureAuthenticated } from '../config/authenticate.js';
import Hash from 'hash.js';
import { flashMessage } from '../utils/messenger.js';
import fs from 'fs';
import upload from '../utils/imageUpload.js'

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


router.get("/upload", ensureAuthenticated, upload_page);
router.get("/update", ensureAuthenticated, update_page);
router.post("/update", update_process);
router.get("/delete", ensureAuthenticated, delete_page);
router.post('/delete', delete_process);

//to be updated
async function upload_page(req, res) {
    console.log("Upload page accessed");
    let email = req.cookies['performer']
    const performer = await Performer.findOne({
        where: { email: email }
    })
    return res.render('performer/settings/upload.html', {
        name: performer.name
    })
};

//to be updated
async function delete_page(req, res) {
    console.log("Performer Delete accessed");
    let email = req.cookies['performer']
    const performer = await Performer.findOne({
        where: { email: email }
    })
    return res.render('performer/settings/delete.html', {
        name: performer.name
    })
};

async function delete_process(req, res) {
    console.log("Performer Delete processing");
    let email = req.cookies['performer']
    const performer = await Performer.findOne({
        where: { email: email }
    })    
    res.cookie('deleteperformer', performer.email, { maxAge: 900000, httpOnly: true });
    res.clearCookie("performer");
    console.log("Performer deleted")
    return res.redirect('../../')
}

async function update_page(req, res) {
    console.log("Performer Update accessed");
    let email = req.cookies['performer']
    const performer = await Performer.findOne({
        where: { email: email }
    })
    return res.render('performer/settings/update.html', {
        name: performer.name,
        email: performer.email
    })
};

async function update_process(req, res) {
    console.log("Update contents received");
    console.log(req.body);
    let email = req.cookies['performer']
    const performer = await Performer.findOne({
        where: { email: email }
    })
    let errors = [];
    //	Check your Form contents
    //	Basic IF ELSE STUFF no excuse not to be able to do this alone
    //	Common Sense
    try {
        if (!regexName.test(req.body.name)) {
            errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
        }
        if (!regexEmail.test(req.body.email)) {
            errors = errors.concat({ text: "Invalid email address!" });
        }
        if (req.body.password != '') {
            if (!regexPwd.test(req.body.password)) {
                errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number and one symbol!" });
            }
        }
        if (errors.length > 0) {
            throw new Error("There are validation errors");
        }
    }
    catch (error) {
        console.error("There is errors with the update form body.");
        console.error(error);
        console.log("smth weird")
        return res.render('performer/settings/update.html', { errors: errors });
    }
    try {
        if (req.body.name == '') {
            req.body.name = performer.name
        }
        if (req.body.email == '') {
            req.body.email = performer.email
        }
        if (req.body.password == '') {
            req.body.password = performer.password
        }
        else {
            req.body.password = Hash.sha256().update(req.body.password).digest("hex")
        }
        console.log("b4 insert")
        Performer.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {
            where: {
                id: performer.id,
            }
        })
        User.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {
            where: {
                id: performer.id,
            }
        })
            .then(() => {
                console.log('insert')
                flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
                console.log(req.body)
                res.cookie('performer', req.body.email, { maxAge: 900000, httpOnly: true });
                return res.redirect("../dashboard");
            }).catch(err => console.log(err))
    }
    catch (error) {
        //	Else internal server error
        console.error(`Failed to update user: ${req.body.email} `);
        console.error(error);
        return res.status(500).end();
    }
};