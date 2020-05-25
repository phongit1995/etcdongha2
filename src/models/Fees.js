let {FeeDB} = require("../databases/Fee");
let getListFee = async ()=>{
    return await FeeDB.findAll();
}
module.exports = {
    getListFee
}