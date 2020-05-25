// Mệnh Giá Tiền Sale off
const Sequelize = require('sequelize');
const db = require("./connectdb");
const DenominationsFlieds = {
    DenominationsID:'DenominationsID',
    DenominationsNumbers :'DenominationsNumbers'
}
const  DenominationsDB=  db.define('Denominations',{
    [DenominationsFlieds.DenominationsID]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [DenominationsFlieds.DenominationsNumbers]:{
        type:Sequelize.DataTypes.NUMBER
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    DenominationsFlieds,DenominationsDB
}