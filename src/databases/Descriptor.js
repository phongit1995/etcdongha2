const Sequelize = require('sequelize');
const db = require("./connectdb");
const DescriptorFields = {
    DescriptorId:'DescriptorId',
    DescriptorContent:'DescriptorContent'
}
// Phí QUa Trạm
const  DescriptorDb=  db.define('Descriptor',{
    [DescriptorFields.DescriptorId]:{
        type:Sequelize.DataTypes.NUMBER,
        primaryKey:true,
        autoIncrement:true
    },
    [DescriptorFields.DescriptorContent]:{
        type:Sequelize.DataTypes.STRING
    }
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = {
    DescriptorFields, DescriptorDb
}