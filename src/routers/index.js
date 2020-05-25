let express= require("express");
let router = express.Router();
let passport = require("passport");
let users = require("./users") ;
let Track = require('./track');
let SaleOff = require('./saleoff');
let Groups = require('./group');
let Guide = require('./guide');
let Me = require('./me');
let TickerMonth = require('./ticketmonth');
let Dh2 = require('./dh2');
let Dh3 = require('./dh3');
let OperatingDiary = require('./operatingdiary');
let {checkIsLogin} = require('./../commons/checkPermisson');


router.get("/",checkIsLogin,(req,res)=>{
    res.render('clients/index',{user:req.user});
})
router.get("/login",(req,res,next)=>{
    if(!req.isAuthenticated()){
        return next();
   }
   return res.redirect("/");
    }
    ,(req,res)=>{
        res.render('clients/login',{error:null});
})
router.get("/logout",checkIsLogin,(req,res)=>{ // Đăng Xuât
    req.logout();
    res.redirect("/");
})
router.post('/login', passport.authenticate('local', { successRedirect: '/',
failureRedirect: '/login' }));
// User others router
router.use("/users" ,users); // User Router
router.use("/track",Track); // Track Router
router.use("/saleoff",SaleOff); // Sale Off Router
router.use("/operatingdiary",OperatingDiary);
router.use("/groups",Groups);
router.use('/guide',Guide); // Page Hướng Dẫn
router.use('/me',Me);  // User Info
router.use('/ticketmonth',TickerMonth);
router.use('/dh2',Dh2); // Page Loading
router.use('/dh3',Dh3); // Page Loading
module.exports  = router ;
