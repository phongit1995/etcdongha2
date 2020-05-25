const Sequelize = require('sequelize');
const db = require("./connectdb");
const HandleErrorFields = {
    HandleErrorId:'HandleErrorId',
    HandleErrorContent:'HandleErrorContent'
}
// Phí QUa Trạm
const  HandleErrorDB=  db.define('HandleError',{
    [HandleErrorFields.HandleErrorId]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [HandleErrorFields.HandleErrorContent]:{
        type:Sequelize.DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    HandleErrorFields, HandleErrorDB
}