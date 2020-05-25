let ResponseHelper = require('./../commons/ResponseHelper');
let TrackModel = require('./../models/track');
let {getListLane} = require('./../models/lane');
let {getListFee} = require('./../models/Fees');
let moment = require('moment-timezone');
let index = async (req,res)=>{
    let {Group,Role} = req.user ;
    let listTrack = await TrackModel.getListTrack(Role,Group);
    let listLane = await getListLane();
    let listFee = await getListFee();
   
    res.render('clients/track/index',{user:req.user,listTrack:listTrack[0],moment:moment,listLane:JSON.parse(JSON.stringify(listLane)),
        listFee:JSON.parse(JSON.stringify(listFee))});
}
let create = async(req,res)=>{

    console.log(req.body);
    try{
        let result = await TrackModel.create(req.body,req.user.Id);
        console.log(result);
         return ResponseHelper.json(res,null,result);
    }
    catch (error){
        console.log(error);
        return ResponseHelper.json(res,error,null);
    }
    
    
}
let getListTrack = async (req,res)=>{
    let {Group,Role} = req.user ;
    let listTrack = await TrackModel.getListTrack(Role,Group);
    let listResult = listTrack[0].map(item=>{
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
}
let DeleteTrack= async (req,res)=>{
    if(!(req.user.Role<3)){
        return ResponseHelper.json(res,'Bạn Không Có Quyền',null);
    }
    try{
        let result = await TrackModel.DeleteTrack(req.body,req.user.Id);
        ResponseHelper.json(res,null,result);
    }catch(error){
        return ResponseHelper.json(res,'Lỗi',null);
    }
    
}
let GetInfo = async (req,res)=>{
    let result = await TrackModel.GetInfoTrack(req.body.Id);
    return ResponseHelper.json(res,null,result.dataValues);
}
let update = async (req,res)=>{
    if(!(req.user.Role<3)){
        return ResponseHelper.json(res,'Bạn Không Có Quyền',null);
    }
    try{
        let Track = await TrackModel.updateTrack(req.body,req.user.Id);
        ResponseHelper.json(res,null,Track);
    }catch(error){
        return ResponseHelper.json(res,'Lỗi',error);
    }
}
let search = async (req,res)=>{
    try {
        console.log(req.body);
        let {Group,Role} = req.user ;
        let result = await TrackModel.searchTrack(Role,Group,req.body);
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
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',error);
    }
    
}
let suggest = async(req,res)=>{
    try {
        let resultSuggest = await TrackModel.suggestTrack(req.body.LicensePlates);
        return ResponseHelper.json(res,null,resultSuggest);
    } catch (error) {
        console.log('Lỗi'+error);
        return ResponseHelper.json(res,'Lỗi',error);
    }
}
module.exports = {
    index,create,getListTrack,DeleteTrack,GetInfo,update,search,suggest
}