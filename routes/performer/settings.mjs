import route from 'express';
const { Router } = route
const router = Router();
export default router;
import User, { UserRole } from '../../models/User.js';
import { ensureAuthenticated } from '../../config/authenticate.js';
import Hash from 'hash.js';
import { flashMessage } from '../../utils/messenger.js';
import fs from 'fs';
import { UploadTo, DeleteFile, DeleteFolder} from '../../utils/multer.mjs'

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/upload", ensureAuthenticated, upload_page);
router.post("/upload", ensureAuthenticated, upload_process);
router.get("/update", ensureAuthenticated, update_page);
router.post("/update", ensureAuthenticated,update_process);
router.get("/delete", ensureAuthenticated, delete_page);
router.post('/delete', ensureAuthenticated,delete_process);

//to be updated|| FORMLESS POST????
async function upload_page(req, res) {
    console.log("Upload page accessed");
    let email = req.cookies['performer']
    const user = await User.findOne({
        where: { email: email,role:UserRole.Performer }
    })
    return res.render('performer/settings/upload.html', {
        name: user.name,
        imgURL: user.imgURL
    })
};
async function upload_process(req,res){
    let email = req.cookies['performer']
    const user = await User.findOne({
        where: { email: email,role:UserRole.Performer }
    })
    console.log("upload process asccessed")
    const Uploader = UploadTo(`public/img/uploads/${user.uuid}/`).single("posterUpload")
    return Uploader(req,res, async function(error_upload) {
        fs.rename(req.file.path, req.file.path +"."+req.file.originalname.split(".")[1], function(err){
            if(err) console.log('ERROR: '+err);
        })
        console.log(req.file)
        if (error_upload) {
            req.flash('error_msg', 'Something wrong happed within the file upload.');
            return res.redirect("performer/settings/upload")
        }
        else{
            try{
                console.log('File uploaded without problems');
                await User.update({
                    imgURL: req.file.path + "." + req.file.originalname.split(".")[1]
                },{
                    where:{
                    uuid: user.uuid,
                    role: UserRole.Performer
                    }
                })
                req.flash('success_msg', 'Profile picture uploaded');
                return res.redirect("../dashboard")
            }
            catch(error){
                DeleteFile(req.file);
                req.flash('error_msg', 'File uploaded but something crashed');
                return res.redirect("../dashboard")
            }
        }
    })
}

//to be updated|| FORMLESS POST?????
async function delete_page(req, res) {
    console.log("Performer Delete accessed");
    let email = req.cookies['performer']
    const user = await User.findOne({
        where: { email: email,role:UserRole.Performer }
    })
    return res.render('performer/settings/delete.html', {
        name: user.name,
        imgURL: user.imgURL
    })
};

async function delete_process(req, res) {
    console.log("Performer Delete processing");
    let email = req.cookies['performer']
    const user = await User.findOne({
        where: { email: email,role:UserRole.Performer }
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
				role: UserRole.Performer
			}
		})	
	}
    res.clearCookie("performer");
    console.log("Performer deleted")
    req.flash('success_msg', 'Performer deleted');
    return res.redirect('../../')
}

async function update_page(req, res) {
    console.log("Performer Update accessed");
    let email = req.cookies['performer']
    const user = await User.findOne({
        where: { email: email,role:UserRole.Performer }
    })
    return res.render('performer/settings/update.html', {
        name: user.name,
        email: user.email,
        imgURL: user.imgURL
    })
};

async function update_process(req, res) {
    console.log("Update contents received");
    console.log(req.body);
    let email = req.cookies['performer']
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
        return res.render('performer/settings/update.html', { error: errors });
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
                role: UserRole.Performer
            }
        })
        flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
        res.cookie('performer', req.body.email, { maxAge: 900000, httpOnly: true });
        req.flash('success_msg', 'Performer Profile Updated');
        return res.redirect("../dashboard");
    }
    catch (error) {
        //	Else internal server error
        console.error(`Failed to update user: ${req.body.email} `);
        console.error(error);
        req.flash('error_msg', 'Something wrong happed within the server.');
        return res.redirect("../dashboard");
    }
};