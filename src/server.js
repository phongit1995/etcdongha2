require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const session = require('express-session');
let passport = require("passport");
const path = require('path');
const router = require('./routers/index');
const db = require("./databases/connectdb");
const initPassportLocal = require("./commons/passport");
const notifications = require('./commons/notifications');
let app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : "etcdongha",
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 60*60*1000 }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(require('flash')());
initPassportLocal(); //  Passport Local
app.set('views',path.join(__dirname,'/views'));
app.set('view engine','ejs');
app.use(async(req,res,next)=>{
    if(req.isAuthenticated()){
        let notification = await notifications(req);
        // console.log(notifications);
        req.user.notifications = notification ;
    }
   
    next();
})
app.use("/",router);

app.listen(process.env.PORT,()=>{
    console.log("kết nối thành công :" + process.env.PORT);
});