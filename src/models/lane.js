let {LaneFields,LaneDB} = require("./../databases/Lane");
let getListLane =async ()=>{
     return await LaneDB.findAll();
}
module.exports= {
    getListLane
}