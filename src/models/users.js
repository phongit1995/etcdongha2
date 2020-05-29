let {UsersDB,UsersField,UsersRole} = require('./../databases/users');
let sequelize = require('./../databases/connectdb');
let moment = require('moment-timezone');
let Texthelper = require('./../commons/TextHelper');
let createUser = async (data,role,group)=>{
    if(role==2){
        data[UsersField.Role]=3,
        data[UsersField.Group]=group;
    }
    data[UsersField.Id]= Texthelper.genId();
    console.log(data);
    let result = await  UsersDB.create({...data});
    return result ;
}
let getUserByPermissions = async (Role,ID,Group)=>{
    let Sql=`
    SELECT * FROM Users LEFT JOIN GroupUsers ON Users.Group = GroupUsers.GroupID WHERE Id != ${ID} 
    and Users.Role>= ${Role} 
    `
    if(Role==2){
        Sql+= `  AND Users.Group=${Group} ` ;
    }
    Sql+= ` and Status >0 ORDER  BY Users.createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let changePasswordUser = async (data,IDUser,Role)=>{
    let {Id,newpassword} = data;
    let user = await  UsersDB.findOne({
        where:{
            [UsersField.Id]:Id
        }
    })
    let NotesAdmin= user.dataValues[UsersField.NotesAdmin] ;
    let Note ={ type:'Changepassword',UserId:IDUser,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm"),
    oldPassword: user.dataValues[UsersField.Password] , newPassword:data.newpassword};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = UsersDB.update({
      [UsersField.Password]:data.newpassword,
      [UsersField.NotesAdmin]:NotesAdmin
    },{
        where:{[UsersField.Id]:Id}
    })
    return result ;
}
let getUserByUsername = async (username)=>{
    let User = await UsersDB.findAll({
        where:{
            [UsersField.UserName]:username
        }
    })
    return User;
}
let getUserById = async (ID)=>{
    let User = await UsersDB.findAll({
        where:{
            [UsersField.Id]:ID
        }
    })
    return User;
}
let delteUser = async (data,IdUser)=>{
    let user = await UsersDB.findOne({
        where:{
            [UsersField.Id]:data.ID
        }
    })
    let NotesAdmin= user.dataValues[UsersField.NotesAdmin] ;
    let Note ={ type:'DeleteUser',UserId:IdUser,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = UsersDB.update({
        [UsersField.Status]:false,
        [UsersField.NotesAdmin]:NotesAdmin
      },{
          where:{[UsersField.Id]:data.ID}
      })
      return result ;
}
let getListUserInGroup  = async (idGroup)=>{
    let listUser = await UsersDB.findAll({
        where:{
            [UsersField.Group]:idGroup
        },
        order:[
            ['Role','ASC']
        ]
    })
    let data = listUser.map((item)=>{
        let info = item.dataValues ;
        UsersRole.map((itemRole)=>{
            if(itemRole.type==info.Role){
                info.position = itemRole.name ;
            }

        })
        return info ;
    });
    return data;
}
let UpdateUser = async (idUser,data) =>{
    let user = await UsersDB.findOne({
        where:{
            [UsersField.Id]:idUser
        }
    })
    delete user.dataValues[UsersField.NotesAdmin];
    let NotesAdmin= user.dataValues[UsersField.NotesAdmin] ;
    let Note ={ type:'UpdateInfo',UserId:idUser,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm"),OldData:user};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    data[UsersField.NotesAdmin] = NotesAdmin;
    let newUser = await UsersDB.update({
       ...data
    }, {
        where:{
            [UsersField.Id]:idUser
        }
    })
     return newUser ;
}
let updatePassword = async (IdUser,password)=>{
    let user = await UsersDB.findOne({
        where:{
            [UsersField.Id]:IdUser
        }
    })
    user.Password= password ;
    user.save();
}
let getListUsers =async ()=>{
    let users = await UsersDB.findAll({
        raw:true
    })
    return users ;
}
module.exports={
    createUser,getUserByPermissions,changePasswordUser,getUserByUsername,delteUser,
    getListUserInGroup,
    getUserById,
    UpdateUser,
    updatePassword,
    getListUsers
}