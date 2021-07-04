import pkg from 'passport-local';
const { Strategy: LocalStrategy} = pkg;
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

function localStrategy(passport){
    passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done) =>{
        User.findOne({
            where:{email:email}
        }).then(user => {
            if(!user) {
                return done(null,false,{message:'No User Found'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err) throw err;
                if(isMatch) {
                    return done(null,user);
                }
                else{
                    return done(null,false,{message: 'Password incorrect'});
                }
            })
        })
    }));
    passport.serializeUser((user,done)=>{
        done(null,user.id);
    })
    passport.deserializeUser((userId,done) =>{
        User.findByPk(userId)
        .then((user) => {
            done(null, user);
        })
        .catch((done) => {
            console.log(done);
        })
    })
}
export default {localStrategy}