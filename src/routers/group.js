let express= require("express");
let router = express.Router();
let {checkIsLogin,CheckIsSuperAdmin} = require('./../commons/checkPermisson');
let GroupController = require('./../controllers/group');
router.get("/", checkIsLogin,CheckIsSuperAdmin,GroupController.index);
router.post('/create',checkIsLogin,CheckIsSuperAdmin,GroupController.create);
module.exports  = router ;
