const Sequelize = require('sequelize');
const db = require("./connectdb");
const StationsFields = {
    StationsID:'StationsID',
    StationsName:'StationsName'
}
const  StationsDB=  db.define('Stations',{
    [StationsFields.StationsID]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [StationsFields.StationsName]:{
        type:Sequelize.DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    StationsFields, StationsDB
}