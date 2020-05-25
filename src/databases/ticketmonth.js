const Sequelize = require('sequelize');
const db = require("./connectdb");
const TicketMonthFiles = {
    TicketId:'TicketId',
    LicensePlates:'LicensePlates', // Biển Số Xe
    NameStations:'NameStations', // Lane
    TypeOfTicket:'TypeOfTicket', // Loại Vé
    CreateByUser:'CreateByUser', // Người Tạo
    Money:'Money', // Giá Tiền
    DateStart:'DateStart', // Ngày Bắt Đầu
    DateEnd:'DateEnd' ,// Ngày kết Thuc
    Image:'Image', // Hình Ảnh
    Status:'Status', // Trạng Thái
    Notes:'Notes', // Notes
    NotesAdmin:'NotesAdmin',
    DateSell:'DateSell', // Kiểu Trạm Import
    Etag:'Etag',// Etag Import
    Agency:'Agency' , // Đại Lý Import
    AccountID:'AccountID'
}
const TicketMonthDB = db.define('Ticket',{
    [TicketMonthFiles.TicketId]:{
        type:Sequelize.DataTypes.TEXT,
        primaryKey:true
    },
    [TicketMonthFiles.LicensePlates]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.NameStations]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.TypeOfTicket]:{
        type:Sequelize.DataTypes.NUMBER
    },
    [TicketMonthFiles.CreateByUser]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.Money]:{
        type:Sequelize.DataTypes.NUMBER
    },
    [TicketMonthFiles.DateStart]:{
        type:Sequelize.DataTypes.TIME
    },
    [TicketMonthFiles.DateEnd]:{
        type:Sequelize.DataTypes.TIME
    },
    [TicketMonthFiles.Image]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.Etag]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.DateSell]:{
        type:Sequelize.DataTypes.TIME
    },
    [TicketMonthFiles.Agency]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.AccountID]:{
        type:Sequelize.DataTypes.STRING
    },
    [TicketMonthFiles.Status]:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    [TicketMonthFiles.Notes]:{
        type:Sequelize.TEXT,
    }
    ,
    [TicketMonthFiles.NotesAdmin]:{
        type:Sequelize.TEXT,
        set(val){
            this.setDataValue(TicketMonthFiles.NotesAdmin,JSON.stringify(val))
        },
        get(){
            if (this.getDataValue(TicketMonthFiles.NotesAdmin)) {
                return JSON.parse(this.getDataValue(TicketMonthFiles.NotesAdmin));
            }
        }
    }
    
},{
    freezeTableName: true
})
module.exports ={
    TicketMonthFiles , TicketMonthDB
}
