let ResponseHelper = require('./../commons/ResponseHelper');
let moment = require('moment-timezone');
let GroupModels = require('./../models/group');
let index = async (req,res)=>{
    let listgroup = await GroupModels.getList();
    // console.log(listgroup);
    res.render('clients/groups/index',{user:req.user,listgroup:listgroup});
}
let create = async (req,res)=>{
    try {
        console.log(req.body);
        let result = await GroupModels.createGroup(req.body.GroupName);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,error,null);
    }
    
}
module.exports = {
    index,create
}