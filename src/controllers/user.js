let UsersModel = require('../databases/users');
let users = require('./../models/users');
let ResponseHelper = require('./../commons/ResponseHelper');
let {getList:ListGroup} = require('./../models/group');
let moment = require('moment-timezone');
let createUser = async (req,res)=>{
    try {
        // console.log(req.body);
        let {UserName}= req.body ;
        let userFind = await users.getUserByUsername(UserName);
        if(userFind.length>0){
            return ResponseHelper.json(res,'Tên Tài Khoản Đã Tồn Tại','Tên Tài Khoản Đã Tồn Tại');
        }
        let {Role,Group}= req.user ;
        let result = await users.createUser(req.body,Role,Group);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,error,error);
    }
}
let GetInfoUser =  async ()=>{
        return await UsersModel.UsersDB.findAll();
}
let checkLogin = async (username,password)=>{
    let User = await UsersModel.UsersDB.findAll({
        where:{
            [UsersModel.UsersField.UserName]:username,
            [UsersModel.UsersField.Password]:password,
            [UsersModel.UsersField.Status]:true
        }
    })
    return User;
}
let GetInfoUserById = async (ID)=>{
    let User = await UsersModel.UsersDB.findAll({
        where:{
            [UsersModel.UsersField.Id]:ID
        }
    })
    return User;
}
let index = async (req,res)=>{
    let {Role,Id,Group}= req.user ;
    // console.log(Role,Id,Group);
    let listUser = await users.getUserByPermissions(Role,Id,Group);
    let ListGroups =  await ListGroup();
    res.render('clients/users/index',{user:req.user,listusers:listUser[0],UsersRole:UsersModel.UsersRole,ListGroups:JSON.parse(JSON.stringify(ListGroups)),
        moment:moment});
}
let changepassword = async (req,res)=>{
    try {
        let {Role,Id,Group}= req.user ;
        let result = await users.changePasswordUser(req.body,Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',error);
    }
   
    
}
let deleteuser = async (req,res)=>{
    try {
        console.log(req.body);
        let {Id,Group}= req.user ;
        let result = await users.delteUser(req.body,Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',error);
    }
}
module.exports ={
    createUser,GetInfoUser,checkLogin,GetInfoUserById,index ,changepassword,deleteuser
}