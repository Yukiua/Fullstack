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
import { UploadTo, DeleteFile, DeleteFolder} from '../../utils/multer.mjs'
import FaqOptions from './faq.mjs'
router.use("/faq", FaqOptions)


const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//	Min 3 character, must start with alphabet
const regexName = /^[a-zA-Z][a-zA-Z]{2,}$/;
//	Min 8 character, 1 upper, 1 lower, 1 number, 1 symbol
const regexPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

router.get("/profile", ensureAuthenticatedAdmin, admin_profile);
router.get("/logout", ensureAuthenticatedAdmin, logout_page);
router.get("/listuser", ensureAuthenticatedAdmin, list_user);
router.get("/updateuser/:id", ensureAuthenticatedAdmin, update_user);
router.post("/updateuser/updatebyadmin", ensureAuthenticatedAdmin, update_by_admin);
router.get('/deletebyadmin/:id', ensureAuthenticatedAdmin, delete_by_admin);
router.get('/sortID', ensureAuthenticatedAdmin, sort_by_id);
router.get('/sortName', ensureAuthenticatedAdmin, sort_by_name);
router.get('/sortEmail', ensureAuthenticatedAdmin, sort_by_email);
router.get('/sortGender', ensureAuthenticatedAdmin, sort_by_gender);
router.get('/sortAge', ensureAuthenticatedAdmin, sort_by_age);
router.get('/sortRole', ensureAuthenticatedAdmin, sort_by_role);
router.get('/sortVerified', ensureAuthenticatedAdmin, sort_by_verified);
router.get('/createuserbyadmin', ensureAuthenticatedAdmin, create_user_by_admin);
router.post('/createuserprocess', ensureAuthenticatedAdmin, create_user_process);
router.get('/managefaq', ensureAuthenticatedAdmin, manage_faq_page);

async function manage_faq_page(req , res) {
	console.log("managefaq page by admin accessed");
	res.cookie('admin',  "admin", { maxAge: 900000, httpOnly: true });
	res.render("admin/manageFaq.html",{
		imgURL: 'public/img/default.png'
	})
}
async function create_user_process(req, res) {
	console.log("create_user_process by admin contents received");
	console.log(req.body);
	let errors = [];
	try {
		if (!regexName.test(req.body.name)) {
			errors = errors.concat({ text: "Invalid name provided! It must be minimum 3 characters and starts with a alphabet." });
		}
		if (!regexEmail.test(req.body.email)) {
			errors = errors.concat({ text: "Invalid email address!" });
		}
		else {
			const user = await User.findOne({ where: { email: req.body.email } });
			if (user != null) {
				errors = errors.concat({ text: "This email cannot be used!" });
			}
		}
		if (!regexPwd.test(req.body.password)) {
			errors = errors.concat({ text: "Password requires minimum eight characters, at least one uppercase letter, one lowercase letter and one number and one symbol!" });
		}
		if (req.body.password !== req.body.password2) {
			errors = errors.concat({ text: "Password do not match!" });
		}
		if (errors.length > 0) {
			throw new Error("There are validation errors");
		}
	}
	catch (error) {
		console.log(errors)
		return res.render('admin/createUserByAdmin.html', { error:errors });
	}
	try {
		const user = await User.create({
			email: req.body.email,
			password: Hash.sha256().update(req.body.password).digest("hex"),
			name: req.body.name,
			age: req.body.age,
			gender: req.body.gender,
			contact: req.body.contact,
			role: UserRole.User,
			verified: true

		});
		//await send_verification(user.uuid, user.email);
		flashMessage(res, 'success', 'Successfully created an account. Please login', 'fas fa-sign-in-alt', true);
		req.flash('success_msg', 'User created successfully');
		return res.redirect("listuser");
	}
	catch (error) {
		//	Else internal server error
		console.error(`Failed to create a new user: ${req.body.email} `);
		console.error(error);role9
		req.flash('error_msg', 'Something wrong happed within the server.');
		return res.render('admin/createUserByAdmin.html')
	}
}

async function create_user_by_admin(req , res ) {
	return res.render('admin/createUserByAdmin.html',{
		imgURL: 'public/img/default.png'
	});
}



async function sort_by_verified(req , res) {
	console.log("Sort By verfied admin page accessed");
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		return (a.verified === b.verified) ? 0 : a.verified ? -1 : 1;
	})
	return res.render('admin/sortVerified.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}


async function sort_by_role(req , res) {
	console.log("Sort By role admin page accessed");
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		let role1 = a.role.toLowerCase(), role2 = b.role.toLowerCase();

   		if (role1 < role2) {
       			return -1;
   		}
   		if (role1 > role2) {
       		return 1;
   		}
   		return 0;
	})
	return res.render('admin/sortRole.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}


async function sort_by_age(req , res) {
	console.log("Sort By age admin page accessed");
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		var number1 = Number.parseInt(a.age);
		var number2 = Number.parseInt(b.age);
		//return number1.age - number2.age;
		if(number1 && number2) return number1 - number2;

   		if(!number1 && !number2) return 0;

   		return !number1 ? -1 : 1;
		


	})
	return res.render('admin/sortAge.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}


async function sort_by_gender(req , res) {
	console.log("Sort By gender admin page accessed");
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		let gender1 = a.gender.toLowerCase(), gender2 = b.gender.toLowerCase();

   		if (gender1 < gender2) {
       			return -1;
   		}
   		if (gender1 > gender2) {
       		return 1;
   		}
   		return 0;
	})
	return res.render('admin/sortGender.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}

async function sort_by_email(req , res) {
	console.log("Sort By admin page accessed");
	console.log("req params for sorting ", req.params.sortBy);
	var sortBy = req.params.sortBy;
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		let email1 = a.email.toLowerCase(), email2 = b.email.toLowerCase();

   		if (email1 < email2) {
       			return -1;
   		}
   		if (email1 > email2) {
       		return 1;
   		}
   		return 0;
	})
	return res.render('admin/sortEmail.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}


async function sort_by_name(req , res) {
	console.log("Sort By admin page accessed");
	console.log("req params for sorting ", req.params.sortBy);
	var sortBy = req.params.sortBy;
	let users = await fetchAllUsers();
	users.sort((a , b) => {
		let name1 = a.name.toLowerCase(), name2 = b.name.toLowerCase();

   		if (name1 < name2) {
       			return -1;
   		}
   		if (name1 > name2) {
       		return 1;
   		}
   		return 0;
	})
	return res.render('admin/sortName.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}

async function sort_by_id(req , res) {
	console.log("Sort By id admin page accessed");
	let users = await fetchAllUsers();
		users.sort((a , b) => {
			return b.sno - a.sno;
		});
	return res.render('admin/sortID.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}


async function delete_by_admin(req, res) {
    console.log("User Delete by admin processing");
	//let email = req.cookies['user'][0];
	console.log("req.body.uuid", req.params.id);
	//console.log("email ---> ", email);
	const user = await User.findOne({
		where : { uuid : req.params.id }
	});
	res.cookie('uuid',  [req.params.id , true], { maxAge: 900000, httpOnly: true });
	res.cookie('admin',  "admin", { maxAge: 900000, httpOnly: true });
    
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
                uuid: user.uuid
			}
		})	
	}
    res.clearCookie("user");
    console.log("User deleted")
    req.flash('success_msg', user.name + ' profile deleted');
    return res.redirect('../listuser')
}

async function update_by_admin(req, res) {
    console.log("Update user process by admin page accessed");
    console.log(req.body);
	let uuid = req.cookies['uuid'][0];
	console.log("req.cookies", uuid);
    const user = await User.findOne({
        where: { uuid: uuid }
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
// 		console.log("errors " , { error: errors });
        return res.render('../profile', { error: errors });
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
		console.log("user.role ----------> ", user.role);
        await User.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            imgURL: req.body.picture
        }, {
            where: {
                uuid: user.uuid,
                role: user.role
            }
        })
        flashMessage(res, 'success', 'Successfully updated By admin. Please login', 'fas fa-sign-in-alt', true);
        //res.cookie('user',  [req.body.email,"user"], { maxAge: 900000, httpOnly: true });
        req.flash('success_msg', 'Profile Updated by Admin');
		console.log("profile updated " , uuid)
        return res.redirect("../listuser");
    }
    catch (error) {
        //	Else internal server error
        console.error(`Failed to update user: ${req.body.email} `);
        console.error(error);
        req.flash('error_msg', 'Something wrong happed within the server.');
        return res.redirect("../profile");
    }
};


async function update_user(req , res) {
	console.log("Update user by admin page accessed");
	console.log("req.body.uuid", req.params.id);
	const user = await User.findOne({
		where : { uuid : req.params.id }
	});
	res.cookie('uuid',  [req.params.id , true], { maxAge: 900000, httpOnly: true });
	res.cookie('admin',  "admin", { maxAge: 900000, httpOnly: true });
	if(user||performer) {
		if(user.dataValues.role == UserRole.User) {
			return res.render('admin/updateuserbyadmin.html', {
			name: user.name,
        	email: user.email,
        	imgURL: user.imgURL,
			updateBy : "admin"
			});
		}
		else if(user.dataValues.role == UserRole.Performer){
			return res.render('admin/updateuserbyadmin.html',{
			name: user.name,
			email:user.email,
			imgURL:user.imgURL,
			updateBy: 'admin'
			});
		}
		 else {
			console.log(" performer ", user.role);
			return res.render('admin/updateperformerbyadmin.html');
		}
	} 
	else {
		console.log("no user for update");
		return res.render('auth/admin/login.html');
	}

}

async function fetchAllUsers() {
	const user = await User.findAll({
        where: { role:[UserRole.Performer , UserRole.User ] }
    })
	let users = [];
	let sno = 0;
	for(var i=0;i < user.length ; i ++) {
		
		if(user[i].dataValues.name != "" && user[i].dataValues.email != "" &&
			user[i].dataValues.password != "" && user[i].dataValues.imgURL != "") {
			var verified = user[i].dataValues.verified;
			sno = sno + 1;
			users.push({
				"sno": sno,
				"name" : user[i].dataValues.name,
				"email" : user[i].dataValues.email,
				"gender": user[i].dataValues.gender,
				"age": user[i].dataValues.age, 
				"role": user[i].dataValues.role,
				"verified": verified,
				"id" : user[i].dataValues.uuid
			})
		}
	}
	return users;

}


async function list_user(req, res) {
	console.log("List profile page accessed");
	let users = await fetchAllUsers();
	console.log("users ----> ", users);
    return res.render('admin/retrieveUsers.html', {
        count: users.length,
        users: users,
		imgURL: 'public/img/default.png'
    })
}



async function admin_profile(req,res) {
    console.log("Admin profile page accessed");
    let email = req.cookies['user'][0]
	console.log("email ---> ", email);
    const user = await User.findOne({
        where: { email: email, role:UserRole.Admin }
    })
    return res.render('admin/profile.html', {
        name: user.name,
        imgURL: user.imgURL
    })
}

async function logout_page(req,res) {
    console.log("Admin Logout accessed");
	req.logout();
	req.flash('success_msg', 'You are logged out.')
	return res.redirect('/')
}