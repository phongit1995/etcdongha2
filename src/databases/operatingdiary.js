const Sequelize = require('sequelize');
const db = require("./connectdb");
const OperatingDiaryFileds = {
    OperatingDiaryId:'OperatingDiaryId',
    LicensePlates:'LicensePlates',
    NameCustomer:'NameCustomer', // Tên Khách Hàng
    Lane:'Lane',
    OperatingDiaryTime:'OperatingDiaryTime', // Thời Gian
    Descriptor:'Descriptor', // Mô Tả
    CreateByUser:'CreateByUser', // Người Tạo
    Image:'Image', // Hình Ảnh
    Handle:'Handle', // Xử Lý
    Status:'Status',
    Notes:'Notes' , // Ghi Chú
    NotesAdmin:'NotesAdmin'
}
const  OperatingDiaryDB=  db.define('OperatingDiary',{
    [OperatingDiaryFileds.OperatingDiaryId]:{
        type:Sequelize.DataTypes.TEXT,
        primaryKey:true,
    },
    [OperatingDiaryFileds.LicensePlates]:{
        type:Sequelize.DataTypes.STRING
    },
    [OperatingDiaryFileds.NameCustomer]:{
        type:Sequelize.DataTypes.STRING,
       
    },
    [OperatingDiaryFileds.CreateByUser]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [OperatingDiaryFileds.Lane]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [OperatingDiaryFileds.OperatingDiaryTime]:{
        type:Sequelize.DataTypes.TIME
    },
    [OperatingDiaryFileds.Image]:{
        type:Sequelize.DataTypes.STRING
    },
    [OperatingDiaryFileds.Descriptor]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [OperatingDiaryFileds.Handle]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [OperatingDiaryFileds.Status]:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    [OperatingDiaryFileds.Notes]:{
        type:Sequelize.TEXT,
    },
    [OperatingDiaryFileds.NotesAdmin]:{
        type:Sequelize.TEXT,
        set(val){
            this.setDataValue(OperatingDiaryFileds.NotesAdmin,JSON.stringify(val))
        },
        get(){
            if (this.getDataValue(OperatingDiaryFileds.NotesAdmin)) {
                return JSON.parse(this.getDataValue(OperatingDiaryFileds.NotesAdmin));
            }
        }
    }
},{
    freezeTableName: true
})
module.exports = {
    OperatingDiaryFileds, OperatingDiaryDB
}