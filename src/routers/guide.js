let express= require("express");
let router = express.Router();
let {checkIsLogin} = require('./../commons/checkPermisson');
router.get("/",checkIsLogin ,async (req,res)=>{
    res.render('clients/guide/index',{user:req.user});
});
module.exports  = router ;
