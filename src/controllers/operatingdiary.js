let ResponseHelper = require('./../commons/ResponseHelper');
let moment = require('moment-timezone');
let {getListDescriptor} = require('./../models/Descriptor');
let {getListhandleerror} = require('./../models/handleerror');
let {getListLane} = require('./../models/lane');
let OperatingDiaryController = require('./../models/operatingdiary');
let index = async (req,res)=>{
    let {Group,Role} = req.user ;
    let [ListDescriptor,Listhandleerror,ListLane,ListOperatingDary] = await Promise.all([getListDescriptor(),getListhandleerror(),getListLane(),OperatingDiaryController.getListOperationgDiary(Role,Group)]);
    // console.log(JSON.parse(JSON.stringify(ListOperatingDary)));
    res.render('clients/operatingdiary/index',{
        user:req.user,
        ListDescriptor:JSON.parse(JSON.stringify(ListDescriptor)),
        Listhandleerror:JSON.parse(JSON.stringify(Listhandleerror)),
        ListLane:JSON.parse(JSON.stringify(ListLane)),
        ListOperatingDary:JSON.parse(JSON.stringify(ListOperatingDary[0])),
        moment:moment
    })
}
let create = async (req,res)=>{
    try {
        // console.log(req.body);
        let result = await OperatingDiaryController.create(req.body,req.user.Id,req.file);
        ResponseHelper.json(res,null,result);
    } catch (error) {
        ResponseHelper.json(res,'Lỗi',null);
    }
} 
let getlist = async (req,res)=>{
    try {
        let {Group,Role} = req.user ; 
        let listOffOperatingDiary = await OperatingDiaryController.getListOperationgDiary(Role,Group);
        let result = listOffOperatingDiary[0].map(item=>{
            if(req.user.Role<3){
                item['canEdit']=true;
                item['canDelete']=true;
            }
            else if(req.user.Id==item.CreateByUser) {
                item['canEdit']=true;
                item['canDelete']=false;
            }
            else{
                item['canEdit']=false;
                item['canDelete']=false;
            }
            return item;
        })
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        return ResponseHelper.json(res,error,null);
    }
}
let deleteOperatingDiary = async (req,res)=>{
    console.log(req.body);
    try {
        let result = await OperatingDiaryController.deleteOperatingDiary(req.body.OperatingDiaryId,req.user.Id);
        console.log(result);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        return ResponseHelper.json(res,error,null);
    }
}
let getInfo = async(req,res)=>{
    console.log(req.body);
    try {
        let result = await OperatingDiaryController.getInfoOperatingDary(req.body.OperatingDiaryId,req.user.Id);
        // console.log(result);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        return ResponseHelper.json(res,error,null);
    }
}
let update = async (req,res)=>{
    try {
        console.log(req.body);
        let result =await OperatingDiaryController.updateOperatingDiary(req.body,req.user.Id,req.file);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',null);
    }
}
let search = async (req,res)=>{
    
    console.log(req.body);
    let {Group,Role} = req.user ;
    let result = await OperatingDiaryController.searchOperatingDiary(Role,Group,req.body);
    let listResult = result[0].map(item=>{
        if(req.user.Role<3){
            item['canEdit']=true;
            item['canDelete']=true;
        }
        else if(req.user.Id==item.CreateByUser) {
            item['canEdit']=true;
            item['canDelete']=false;
        }
        else{
            item['canEdit']=false;
            item['canDelete']=false;
        }
        return item;
    })
    return ResponseHelper.json(res,null,listResult);
    console.log(error);
    return ResponseHelper.json(res,'Lỗi',error);
}
module.exports = {
    index,create,getlist,deleteOperatingDiary,getInfo,update,search
}