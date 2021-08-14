import route from 'express';
const { Router } = route
const router = Router();
export default router;
import User, { UserRole } from '../../models/User.js';
import { ensureAuthenticatedCustomer } from '../../config/authenticate.js';
import Hash from 'hash.js';
import { flashMessage } from '../../utils/messenger.js';
import fs from 'fs';
import { UploadTo, DeleteFile, DeleteFolder} from '../../utils/multer.mjs'

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/update", ensureAuthenticatedCustomer, update_page);
router.post("/update", ensureAuthenticatedCustomer, update_process);
router.get("/delete", ensureAuthenticatedCustomer, delete_page);
router.post('/delete', ensureAuthenticatedCustomer, delete_process);

//to be updated|| FORMLESS POST?????
async function delete_page(req, res) {
    console.log("User Delete accessed");
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email: email,role:UserRole.User }
    })
    return res.render('user/settings/delete.html', {
        name: user.name,
        imgURL: user.imgURL
    })
};

async function delete_process(req, res) {
    console.log("User Delete processing");
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email: email,role:UserRole.User }
    })
    if(user.imgURL != "public/img/default.png"){
        console.log(`Deleting ${user.uuid}'s picture`)
        DeleteFolder(`public/img/uploads/${user.uuid}`);
    }
    console.log(`Deleting ${user.name}`)
    if(user !== undefined){
		User.update({
            name: "",
            email: "",
            password: "",
            imgURL: "",
        },{			
            where: {
                uuid: user.uuid,
				email: user.email,
				role: UserRole.User
			}
		})	
	}
    res.clearCookie("user");
    console.log("User deleted")
    req.flash('success_msg', 'User deleted');
    return res.redirect('../../')
}

async function update_page(req, res) {
    console.log("User Update accessed");
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email: email,role:UserRole.User }
    })
    return res.render('user/settings/update.html', {
        name: user.name,
        email: user.email,
        imgURL: user.imgURL
    })
};

async function update_process(req, res) {
    console.log("Update contents received");
    console.log(req.body);
    let email = req.cookies['user'][0]
    const user = await User.findOne({
        where: { email: email }
    })
    let errors = [];
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
        console.log("There is errors with the update form body.")
        return res.render('user/settings/update.html', { error: errors });
    }
    try {
        if (req.body.name == '') {
            req.body.name = user.name
        }
        if (req.body.email == '') {
            req.body.email = user.email
        }
        if(req.body.picture == ''){
            req.body.picture = user.imgURL
        }
        if (req.body.password == '') {
            req.body.password = user.password
        }
        else {
            req.body.password = Hash.sha256().update(req.body.password).digest("hex")
        }
        await User.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            imgURL: req.body.picture
        }, {
            where: {
                uuid: user.uuid,
                role: UserRole.User
            }
        })
        flashMessage(res, 'success', 'Successfully updated your account. Please login', 'fas fa-sign-in-alt', true);
        res.cookie('user',  [req.body.email,"user"], { maxAge: 900000, httpOnly: true });
        req.flash('success_msg', 'User Profile Updated');
        return res.redirect("../profile");
    }
    catch (error) {
        //	Else internal server error
        console.error(`Failed to update user: ${req.body.email} `);
        console.error(error);
        req.flash('error_msg', 'Something wrong happed within the server.');
        return res.redirect("../profile");
    }
};