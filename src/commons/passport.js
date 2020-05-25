let passport = require("passport");
let passportLocal = require("passport-local");
let {checkLogin,GetInfoUserById} = require('./../controllers/user');
let LocalStrategy = passportLocal.Strategy;
let initPassportLocal = ()=>{
    passport.use(new LocalStrategy({
        usernameField:"username",
        passwordField:"password",
        passReqToCallback:true
    }, async (req,username,password,done)=>{
        try{
            let user = await checkLogin(username,password);
            if(user.length>0){
                return done(null, user[0].dataValues);
            }
            else{
                return done(null,false,req.flash("errors",'Sai tài khoản hoặc mật khẩu !'));
            }
           
        }
        catch(error){

        }
    }))
    passport.serializeUser((user,done)=>{
        done(null,user);
    })
    passport.deserializeUser( async (id,done)=>{
        done(null,id);
    })
}
module.exports = initPassportLocal;