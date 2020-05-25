let {GroupUsersDB,GroupUsersFields} = require('./../databases/GroupUsers');
let {UsersDB,UsersField} = require('./../databases/users');
let getList = async ()=>{
    let result = await GroupUsersDB.findAll();
    let list = result.map(async item=>{
        // console.log(item.dataValues.GroupID);
        let manager = await getNameManger(item.dataValues.GroupID);
        let listUser = await getListUserGroup(item.dataValues.GroupID);
        item.dataValues.Manager = JSON.parse( JSON.stringify( manager )) ;
        // console.log(JSON.parse( JSON.stringify( manager )));
        item.dataValues.numberUser= listUser.length ;
        // console.log(item);
        return item ;
    }) ;
   return await Promise.all( list);
}
let createGroup = async (nameGroup)=>{
    let result = await GroupUsersDB.create({
        [GroupUsersFields.GroupName]:nameGroup
    })
    return result ;
}
let GetInfoGroups = async (idGroup)=>{
    let result = await GroupUsersDB.findOne({
        where:{
            [GroupUsersFields.GroupID]:idGroup
        }
    });
    return result;
}
module.exports = {
    getList,createGroup,GetInfoGroups
}
let getNameManger = async (Group)=>{
    let listManager = await UsersDB.findAll({
        where:{
            [UsersField.Group]:Group ,
            [UsersField.Status]:true,
            [UsersField.Role]:2
        }
    })
    return listManager ;
}
let getListUserGroup = async (Group)=>{
    let listUser = await UsersDB.findAll({
        where:{
            [UsersField.Status]:true,
            [UsersField.Group]:Group ,
        }
    })
    return listUser ;
}