const Sequelize = require('sequelize');
const db = require("./connectdb");
const UsersField = {
    Id:'Id',
    UserName:'UserName',
    Password:'Password',
    Name:'Name',
    Avatar:'Avatar',
    Email:'Email',
    Phone:'Phone',
    Introduce:'Introduce',
    DateOfBirth:'DateOfBirth',
    Role:'Role',
    Group:'Group',
    NotesAdmin:'NotesAdmin',
    Status:'Status',
    Showpage:'Showpage'
}
const UsersRole = [
    {
        type:1,
        name:'ADMIN'
    },
    {
        type:2,
        name:'Tổ Trưởng'
    },
    {
        type:3,
        name:'Nhân Viên'
    }
]


const UsersDB=  db.define('Users',{
    [UsersField.Id]:{
        type:Sequelize.DataTypes.CHAR,
        primaryKey:true
    },
    [UsersField.UserName]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.Password]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.Name]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.Avatar]:{
        type:Sequelize.DataTypes.STRING ,
        defaultValue: "default.jpeg"
    },
    [UsersField.Email]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.Introduce]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.Phone]:{
        type:Sequelize.DataTypes.STRING 
    },
    [UsersField.DateOfBirth]:{
        type:Sequelize.TIME
    },
    [UsersField.Role]:{
        type:Sequelize.DataTypes.NUMBER
    },
    [UsersField.Group]:{
        type:Sequelize.DataTypes.NUMBER
    },
    [UsersField.Status]:{
        type:Sequelize.BOOLEAN,
        defaultValue:true
    },
    [UsersField.NotesAdmin]:{
        type:Sequelize.TEXT,
        set(val){
            this.setDataValue(UsersField.NotesAdmin,JSON.stringify(val))
        },
        get(){
            if (this.getDataValue(UsersField.NotesAdmin)) {
                return JSON.parse(this.getDataValue(UsersField.NotesAdmin));
            }
        }
    },
    [UsersField.Showpage]:{
        type:Boolean,
        default:false
    }
})
module.exports = {
    UsersDB,
    UsersRole,
    UsersField
}