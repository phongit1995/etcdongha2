const Sequelize = require('sequelize');
const db = require("./connectdb");
const FeeField = {
    IdFee:'IdFee',
    FeeNumbers:'FeeNumbers'
}
// Phí QUa Trạm
const  FeeDB=  db.define('Fees',{
    [FeeField.IdFee]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [FeeField.FeeNumbers]:{
        type:Sequelize.DataTypes.NUMBER
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    FeeField, FeeDB
}