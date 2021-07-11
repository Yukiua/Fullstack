  
import route from 'express';
const { Router } = route;
const router = Router();
import passport from 'passport';
import crypt from 'bcryptjs';
const { genSalt, hash } = crypt;
import User from '../../models/User.js';
import sendmail from '@sendgrid/mail';
const { setApiKey, send } = sendmail;


// JWT
import jsonwebtoken from 'jsonwebtoken';
const { verify, sign } = jsonwebtoken;

// Flash Messegner
import alertMessage from '../../utils/messenger.js';


router.get("/login", async function(req, res){
	return res.render('auth/user/login.html'); 
});
	
router.get("/signup", async function(req, res){
return res.render('auth/user/signup.html'); 
});

router.get('/verify/:userId/:token', (req, res, next) => {
    // retreiever from user check, then set verified to true
    User.findOne({
        where: {
            id: req.params.userId
        }
    }).then(user => {
        if (user) {
            let userEmail = user.email;
            if (user.verified === true) {
                alertMessage(res, 'info', 'User already verified', 'fas fa-exclamation-circle', true);
                res.redirect('/login');
            } else {
                verify(req.params.token, 's3cr3Tk3y', (err, authData) => {
                    if (err) {
                        alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
                        res.redirect('/');
                    } else {
                        User.update({
                            verified: 1
                        }, {
                            where: {
                                id: user.id
                            }
                        }).then(user => {
                            alertMessage(res, 'success', userEmail + ' verified. Please login', 'fas fa-sign-in-alt', true);
                            res.redirect('/login');
                        });
                    }
                });
            }
        } else {
            alertMessage(res, 'danger', 'Unauthorised Access', 'fas fa-exclamation-circle', true);
            res.redirect('/');
        }
    });
});
function sendEmail(userId, email, token) {
    setApiKey(process.env.SENDGRID_API_KEY);

    const message = {
        to: email,
        from: 'Do Not Reply <admin@video-jotter.sg>',
        subject: 'Verify Video Jotter Account',
        text: 'and easy to do anywhere, even with Node.js',
        html: `Thank you registering with Video Jotter.<br><br>
Please <a href="http://localhost:5000/user/verify/${userId}/${token}"><strong>verify</strong></a>
your account.`
    };
    send(message);
}
// Login Form POST => /user/login
router.post('/login', (req, res, next) => {
    // Check if email verified
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            if (user.verified !== true) {
                alertMessage(res, 'danger', 'Email ' + user.email + ' has not been verified.', 'fas fa-exclamation-circle', true);
                res.redirect('/');
            }
        }
        authenticate('local', {
            successRedirect: '/user/profile', // Route to /video/listVideos URL
            failureRedirect: '/auth/user/login', // Route to /login URL
            failureFlash: true
            /*
             * Setting the failureFlash option to true instructs Passport to flash an  error message
             * using the message given by the strategy's verify callback, if any. When a failure occurs
             * passport passes the message object as error
             * */
        })(req, res, next);
    });
});

// User Register Route  => /user/register
router.post('/register', (req, res) => {
    let errors = [];

    // Retrieves fields from register page from request body
    let {
        name,
        email,
        password,
        password2
    } = req.body;

    // Checks if both passwords entered are the same
    if (password !== password2) {
        errors.push({
            text: 'Passwords do not match'
        });
    }

    // Checks that password length is more than 4
    if (password.length < 4) {
        errors.push({
            text: 'Password must be at least 4 characters'
        });
    }

    /*
     If there is any error with password mismatch or size, then there must be
     more than one error message in the errors array, hence its length must be more than one.
     In that case, render register.handlebars with error messages.
     */
    if (errors.length > 0) {
        res.render('/auth/user/signup.html', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // If all is well, checks if user is already registered
        User.findOne({
            where: {
                email
            }
        }).then(user => {
            if (user) {
                // If user is found, that means email given has already been registered
                //req.flash('error_msg', user.name + ' already registered');
                res.render('/auth/user/signup.html', {
                    error: user.email + ' already registered',
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                // Generate JWT token
                let token;
                sign(email, 's3cr3Tk3y', (err, jwtoken) => {
                    if (err) console.log('Error generating Token: ' + err);
  
                    token = jwtoken;
                });

                // Generate salt hashed password
                genSalt(10, (err, salt) => {
                    hash(password, salt, (err, hash) => {
                        if (err) throw err;
                        password = hash;
                        // Create new user record
                        User.create({
                            name,
                            email,
                            password,
                            verified: 0,
                        }).then(user => {
                            sendEmail(user.id, user.email, token);
                            alertMessage(res, 'success',
                                user.name + ' added. Please logon to ' + user.email + ' to verify account.', 'fas fa-sign-in-alt', true);
                            res.redirect('/login');
                        }).catch(err => console.log(err));
                    })
                });
            }
        });

    }
});

export default router;