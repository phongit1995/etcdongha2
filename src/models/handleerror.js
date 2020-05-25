let {HandleErrorDB} = require("../databases/handleError");
let getListhandleerror = async ()=>{
    return await HandleErrorDB.findAll();
}
module.exports = {
    getListhandleerror
}