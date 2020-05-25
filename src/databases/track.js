const Sequelize = require('sequelize');
const db = require("./connectdb");
const TrackFields = {
    TrackId:'TrackId',
    LicensePlates:'LicensePlates', // Biển Số Xe
    NameCustomer:'NameCustomer', // Tên Khách Hàng
    Lane:'Lane', // Lane
    TrackTime:'TrackTime', // Thời Gian 
    CreateByUser:'CreateByUser', // Người Tạo
    Image:'Image', // Hình Ảnh
    TrackFee:'TrackFee', // Rate
    Status:'Status', // Trạng Thái
    Notes:'Notes', // Notes
    NotesAdmin:'NotesAdmin'
}
const TrackDB = db.define('Track',{
    [TrackFields.TrackId]:{
        type:Sequelize.DataTypes.CHAR,
        primaryKey:true
    },
    [TrackFields.LicensePlates]:{
        type:Sequelize.DataTypes.STRING
    },
    [TrackFields.NameCustomer]:{
        type:Sequelize.DataTypes.STRING
    },
    [TrackFields.Lane]:{
        type:Sequelize.DataTypes.STRING
    },
    [TrackFields.TrackTime]: {
        type:Sequelize.TIME
    },
    [TrackFields.CreateByUser]:{
        type:Sequelize.DataTypes.STRING
    },
    [TrackFields.Image]:{
        type:Sequelize.DataTypes.STRING
    },
    [TrackFields.TrackFee]:{
        type:Sequelize.NUMBER
    },
    [TrackFields.Status]:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    [TrackFields.Notes]:{
        type:Sequelize.TEXT,
    }
    ,
    [TrackFields.NotesAdmin]:{
        type:Sequelize.TEXT,
        set(val){
            this.setDataValue(TrackFields.NotesAdmin,JSON.stringify(val))
        },
        get(){
            if (this.getDataValue(TrackFields.NotesAdmin)) {
                return JSON.parse(this.getDataValue(TrackFields.NotesAdmin));
            }
        }
    }
    
},{
    freezeTableName: true
})
module.exports ={
    TrackFields , TrackDB
}
