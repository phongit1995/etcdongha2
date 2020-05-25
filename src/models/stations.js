let {StationsDB} = require('./../databases/stations');
let getListStations = async ()=>{
    return await StationsDB.findAll();
}
module.exports = {
    getListStations
}