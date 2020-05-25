const Sequelize = require('sequelize');
const db = require("./connectdb");
const SaleOffFields = {
    SaleOffID:'SaleOffID',
    LicensePlates:'LicensePlates',
    NameCustomer:'NameCustomer', // Tên Khách Hàng
    TypeOfSaleOff:'TypeOfSaleOff',
    CreateByUser:'CreateByUser', // Người Tạo
    Image:'Image', // Hình Ảnh
    Denominations:'Denominations', // Mệnh Giá
    DateStart:'DateStart', // Ngày Bắt Đầu
    DateEnd:'DateEnd' ,// Ngày kết Thuc
    Status:'Status',
    Notes:'Notes' , // Ghi Chú
    NotesAdmin:'NotesAdmin',
    TrackingNo:'TrackingNo',
    StatusPro:'StatusPro',
    AddVn:'AddVn',
    PhoneVn:'PhoneVn',
    AddJp :'AddJp',
    PhoneJp:'PhoneJp',
    Notting:'Notting',
    NameProduct:'NameProduct',
    QtyPro:'QtyPro',
    RatePro:'RatePro',
    TickMoney:'TickMoney',
    DateDeli:'DateDeli'

}
const  SaleOffDB=  db.define('SaleOff',{
    [SaleOffFields.SaleOffID]:{
        type:Sequelize.DataTypes.TEXT,
        primaryKey:true,
   
    },
    [SaleOffFields.LicensePlates]:{
        type:Sequelize.DataTypes.STRING
    },
    [SaleOffFields.NameCustomer]:{
        type:Sequelize.DataTypes.STRING
    },
    [SaleOffFields.CreateByUser]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [SaleOffFields.TypeOfSaleOff]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [SaleOffFields.Denominations]:{
        type:Sequelize.DataTypes.INTEGER
    },
    [SaleOffFields.Image]:{
        type:Sequelize.DataTypes.STRING
    },
    [SaleOffFields.DateStart]:{
        type:Sequelize.DataTypes.TIME
    },
    [SaleOffFields.DateEnd]:{
        type:Sequelize.DataTypes.TIME
    },
    [SaleOffFields.Status]:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    [SaleOffFields.Notes]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.NotesAdmin]:{
        type:Sequelize.TEXT,
        set(val){
            this.setDataValue(SaleOffFields.NotesAdmin,JSON.stringify(val))
        },
        get(){
            if (this.getDataValue(SaleOffFields.NotesAdmin)) {
                return JSON.parse(this.getDataValue(SaleOffFields.NotesAdmin));
            }
        }
    },
    [SaleOffFields.StatusPro]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.TrackingNo]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.AddVn]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.PhoneVn]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.AddJp]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.PhoneJp]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.Notting]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.NameProduct]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.QtyPro]:{
        type:Sequelize.INTEGER,
    },
    [SaleOffFields.RatePro]:{
        type:Sequelize.INTEGER,
    },

    [SaleOffFields.TickMoney]:{
        type:Sequelize.TEXT,
    },
    [SaleOffFields.DateDeli]:{
        type:Sequelize.DataTypes.TIME,
    },
},{
    freezeTableName: true
})
module.exports = {
    SaleOffFields, SaleOffDB
}