let express= require("express");
let router = express.Router();
let {checkIsLogin} = require('../commons/checkPermisson');
let Me = require('./../controllers/me');
let path = require('path');
let multer  = require('multer');
let {uploadFileToServer} = require('./../commons/middleware');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/storage'));
    },
    filename: function (req, file, cb) {
      cb(null, req.user.Id+'-' + Date.now()+'-'+ file.originalname);
    }
})
let upload = multer({ storage: storage })
router.get("/",checkIsLogin ,Me.index);
router.post("/update",checkIsLogin,Me.updateUser);
router.post("/updateavatar",upload.single("image"), uploadFileToServer,Me.updateImage);
router.post('/changepassword',Me.changepassword)
module.exports  = router ;
