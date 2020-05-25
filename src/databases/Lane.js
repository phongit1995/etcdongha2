const Sequelize = require('sequelize');
const db = require("./connectdb");
const LaneFields = {
    LaneID:'LaneID',
    LaneName:'LaneName'
}
const  LaneDB=  db.define('Lane',{
    [LaneFields.LaneID]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [LaneFields.LaneName]:{
        type:Sequelize.DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    LaneFields, LaneDB
}