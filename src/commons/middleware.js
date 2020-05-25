let request = require('request-promise');
let fs = require('fs');
const URLUPLOAD ='http://wooeu.net/home/?page=uploadimage';
let uploadFileToServer = async(req,res,next)=>{
    try {
        if(req.file){
            let options = {
                method:'post',
                url:URLUPLOAD,
                formData:{
                    image:{
                        value:fs.createReadStream(req.file.path),
                        options: {
                            filename: req.file.filename,
                            contentType: req.file.mimetype
                        }
                    }
                }
            }
            let result = await request(options);
        };
        next();
    } catch (error) {
        // console.log(error);
        next();
    }
}
module.exports = {
    uploadFileToServer
}