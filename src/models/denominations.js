let {DenominationsDB}  = require('./../databases/denominations');
let GetListDenomintations = async ()=>{
    return  await DenominationsDB.findAll();
}

module.exports ={
    GetListDenomintations
}