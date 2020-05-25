let ResponseHelper = require('./../commons/ResponseHelper');
let moment = require('moment-timezone');
let  {GetListDenomintations} = require('./../models/denominations');
let {getListTypeOffSaleOff} = require('./../models/typeoffsaleoff');
let SaleOffModel= require('./../models/saleoff');
let index = async (req,res)=>{
    let {Group,Role} = req.user ;
    let [listDenomintations,listTypeOffSaleOff,listSaleOff] = await Promise.all([GetListDenomintations(),getListTypeOffSaleOff(),SaleOffModel.GetListSaleOff(Role,Group)]);
    // console.log(JSON.parse(JSON.stringify(listDenomintations)));
    console.log(listSaleOff);
    res.render('clients/saleoff/index',{user:req.user,listDenomintations:JSON.parse(JSON.stringify(listDenomintations)),
        listTypeOffSaleOff:JSON.parse(JSON.stringify(listTypeOffSaleOff)) , moment:moment,listSaleOff:listSaleOff[0]})
}
let create = async (req,res)=>{
    try{
        console.log(req.body);
        let result = await  SaleOffModel.create(req.body,req.user.Id,req.file);
       ResponseHelper.json(res,null,result);
    }
    catch(error){
        ResponseHelper.json(res,'Lỗi',null);
    }
   
}
let getlistSaleOff = async(req,res)=>{
    try {
        let {Group,Role} = req.user ;
        let listSaleOff = await SaleOffModel.GetListSaleOff(Role,Group);
        let listResult = listSaleOff[0].map(item=>{
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
        return ResponseHelper.json(res,error,null);
    }
   
}
let deleteSaleoff = async (req,res)=>{
    if(!(req.user.Role<3)){
        return ResponseHelper.json(res,'Bạn Không Có Quyền',null);
    }
    try {
        let result = await SaleOffModel.deleteSaleoff(req.body,req.user.Id);
        ResponseHelper.json(res,null,result);
    } catch (error) {
        return ResponseHelper.json(res,'Lỗi',error);
    }
}
let getInfo = async (req,res)=>{
    try {
        let result = await SaleOffModel.GetInfoSaleOff(req.body.Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',error);
    }
    

}
let updateSaleOff = async (req,res)=>{
    try {
        // console.log(req.body);
        let result = await SaleOffModel.updateSaleOff(req.body,req.user.Id,req.file);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,'Lỗi',null);
    }
    
}
let search = async (req,res)=>{
    try {
        let {Group,Role} = req.user ;
        console.log(req.body);
        let result = await  SaleOffModel.searchSaleoff(Role,Group,req.body);
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

module.exports = {
    index,create,getlistSaleOff,deleteSaleoff,getInfo,updateSaleOff,search 
}