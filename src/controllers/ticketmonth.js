let {getListStations} = require('./../models/stations');
let {getListTypeOfTicket} = require('./../models/typeofticket');
let ResponseHelper = require('./../commons/ResponseHelper');
let moment = require('moment-timezone');
let TicketModels = require('./../models/ticket');
const ExpriedDays =3 ;
let index = async(req,res)=>{
    console.log(req.user);
    let {Group,Role} = req.user ;
    let listStation = await getListStations();
    let listTypeOfTicket = await getListTypeOfTicket();
    // console.log(JSON.parse(JSON.stringify(listStation)),listTypeOfTicket);
    let listTicketMonth = await TicketModels.getlistTicketMonth(Role,Group);
    let listTicketExpriedDay = await TicketModels.getListTicketExpired(Role,Group,ExpriedDays);
    // console.log(listTicketMonth[0]);
    res.render("clients/ticketmonth/index",{user:req.user,
        listStations:JSON.parse(JSON.stringify(listStation)),
        listTypeOfTickets:JSON.parse(JSON.stringify(listTypeOfTicket)),
        listTicketMonth:listTicketMonth[0],
        listTicketExpriedDay:listTicketExpriedDay[0],
        moment:moment
    })
}
let createTicket = async (req,res)=>{
    try {
        let {Id} = req.user ;
        // console.log(req.body);
        let result = await TicketModels.createTicket(req.body,Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,error,null);
    }
    
}
let deleteTicket = async (req,res)=>{
    try {
        let {TicketId} = req.body ;
        let {Id} = req.user;
        let result = await TicketModels.deleteTicket(TicketId,Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        console.log(error);
        return ResponseHelper.json(res,error,null);
    }
}
let getListTicket = async (req,res)=>{
    let {Group,Role} = req.user ;
    let listTicketMonth = await TicketModels.getlistTicketMonth(Role,Group);
    let listTicketMonths = listTicketMonth[0].map(item=>{
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
    return ResponseHelper.json(res,null,listTicketMonths);
}
let getInfo = async(req,res)=>{
    let {id}= req.body ;
    let result = await TicketModels.getinfoTicket(id);
    return ResponseHelper.json(res,null,result);
}
let updateTicket = async(req,res)=>{
    // console.log(req.body);
    let {Id} = req.user;
    let result = await TicketModels.updateTicket(req.body,Id);
    console.log(result);
    return ResponseHelper.json(res,null,result);
}
let searchTicket = async (req,res)=>{
    console.log(req.body);
    let {Group,Role} = req.user ;
    let resultSearch = await TicketModels.searchTicket(Role,Group,req.body);
    // console.log(resultSearch[0]);
    let listResult = resultSearch[0].map(item=>{
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
let importTicket = async (req,res)=>{
    try {
        let {Id} = req.user ;
        let result = await TicketModels.ImportTicket(req.body.data,Id);
        return ResponseHelper.json(res,null,result);
    } catch (error) {
        return ResponseHelper.json(res,error,null);
    }
    
}
module.exports = {
    index ,createTicket ,deleteTicket,getListTicket ,getInfo ,
    updateTicket,
    searchTicket,
    importTicket
}