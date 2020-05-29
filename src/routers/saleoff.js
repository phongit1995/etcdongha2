let express= require("express");
let router = express.Router();
let SaleOffController = require('./../controllers/saleoff');
let {checkIsLogin} = require('./../commons/checkPermisson');
let path = require('path');
let multer  = require('multer');
let {uploadFileToServer} = require('./../commons/middleware');
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'../public/images/storage'));
    },
    filename: function (req, file, cb) {
      let filename = req.user.Id+'-' + Date.now()+'-'+ file.originalname ;
      if(req.body.TrackingNo) {
        filename  = req.body.TrackingNo +"-"+ filename ;
      }
      cb(null, filename);
    }
})
let upload = multer({ storage: storage })

router.get('/',checkIsLogin, SaleOffController.index);
router.post('/create',checkIsLogin, upload.single('FileImages'),uploadFileToServer,SaleOffController.create);
router.post('/getlist',checkIsLogin,SaleOffController.getlistSaleOff);
router.post('/delete',checkIsLogin,SaleOffController.deleteSaleoff);
router.post('/getInfo',checkIsLogin,SaleOffController.getInfo);
router.post('/update',checkIsLogin,upload.single('FileImages'),uploadFileToServer,SaleOffController.updateSaleOff);
router.post('/search',checkIsLogin,SaleOffController.search);

module.exports  = router ;
