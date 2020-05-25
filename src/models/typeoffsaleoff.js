let {TypeOfSaleOffDB} = require('./../databases/typeofsaleoff');
let getListTypeOffSaleOff  = async ()=>{
   return await  TypeOfSaleOffDB.findAll();
}
module.exports = {
    getListTypeOffSaleOff
}