let groupsModels = require('./../models/group');
let UserModels = require('./../models/users');
let index = async (req,res)=>{
    let users = await UserModels.getUserById(req.user.Id);
    console.log(req.user);
    let userInfo = users[0].dataValues;
    let {Group,notifications} = req.user;
    userInfo.notifications = notifications;
    let groups = await groupsModels.GetInfoGroups(Group);
    userInfo.GroupName= groups.dataValues.GroupName ;
    let infoGroup = await UserModels.getListUserInGroup(Group);
    userInfo.groups = infoGroup ;
    console.log(userInfo);
    res.render('clients/me/index',{user:userInfo});
}
let updateUser = async (req,res)=>{
    console.log(req.body);
    let {Id} = req.user;
    let User = await UserModels.UpdateUser(Id,req.body);
    return res.json({error:null})
}
let updateImage = async (req,res)=>{
    try {
        let {Id} = req.user;
        let users = await UserModels.UpdateUser(Id,{Avatar:req.file.filename});
        return res.json({error:null})
    } catch (error) {
        
    }
}
let changepassword = async (req,res)=>{
    let {Id} = req.user;
    console.log(req.user);
    console.log(req.body);
    if(req.user.Password !=req.body.password){
        return res.json({
            error:'Mật Khẩu Sai'
        })
    }else{
        let result = await  UserModels.updatePassword(Id,req.body.newpassword);
        return res.json({
            error:null,
            message:'Cập Nhật Mật Khẩu Thành Công'
        })
    }
}
module.exports = {
    index,updateUser,updateImage ,changepassword
}