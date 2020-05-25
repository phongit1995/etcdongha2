const Sequelize = require('sequelize');
const db = require("./connectdb");
const TypeOfTicketFields = {
    TypeOfTicketID:'TypeOfTicketID',
    TypeOfTicketName:'TypeOfTicketName'
}
const  TypeOfTicketDB=  db.define('TypeOfTicket',{
    [TypeOfTicketFields.TypeOfTicketID]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [TypeOfTicketFields.TypeOfTicketName]:{
        type:Sequelize.DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    TypeOfTicketFields, TypeOfTicketDB
}