let {TicketMonthDB,TicketMonthFiles} = require('./../databases/ticketmonth');
let sequelize = require('./../databases/connectdb');
let Texthelper = require('./../commons/TextHelper');
let moment = require('moment-timezone');
let {getListStations} = require('./../models/stations');
let  {getListTypeOfTicket} = require('./../models/typeofticket');
let {TypeOfTicketFields} = require('./../databases/typeofticket');
let {StationsFields} = require('./../databases/stations');
let getlistTicketMonth = async (Role,Group)=>{
    let Sql = `SELECT Ticket.* , Users.UserName, Users.Id,TypeOfTicket.TypeOfTicketName ,Stations.StationsName    FROM Ticket LEFT JOIN Users ON Ticket.CreateByUser =Users.Id LEFT JOIN Stations On Ticket.NameStations=Stations.StationsID  LEFT JOIN TypeOfTicket ON 
    Ticket.TypeOfTicket = TypeOfTicket.TypeOfTicketID where Ticket.Status=1 `;
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    Sql+= ` ORDER  BY createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let getListTicketExpired = async (Role,Group,ExpriedDay)=>{
    let Sql = `SELECT Ticket.* , Users.UserName, Users.Id,TypeOfTicket.TypeOfTicketName ,Stations.StationsName    FROM Ticket LEFT JOIN Users ON Ticket.CreateByUser =Users.Id LEFT JOIN Stations On Ticket.NameStations=Stations.StationsID  LEFT JOIN TypeOfTicket ON 
    Ticket.TypeOfTicket = TypeOfTicket.TypeOfTicketID where Ticket.Status=1 AND DATE(Ticket.DateEnd) BETWEEN DATE(NOW()) AND DATE(ADDDATE(NOW(),INTERVAL ${ExpriedDay} DAY))`;
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    Sql+= ` ORDER  BY createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let createTicket = async (data,IdUser)=>{
    data[TicketMonthFiles.TicketId]=Texthelper.genId();
    data[TicketMonthFiles.CreateByUser]=IdUser;
    console.log(data);
    let result = await TicketMonthDB.create(data);
    return result ;
}
let deleteTicket = async (IdTicket,IdUser) =>{
    let Ticket = await TicketMonthDB.findOne({
        where:{
            [TicketMonthFiles.TicketId]:IdTicket
        }
    })
    // console.log(Ticket);
    let NotesAdmin= Ticket.dataValues[TicketMonthFiles.NotesAdmin] ;
    let Note ={ type:'Delete',UserId:IdUser,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = await TicketMonthDB.update({
        [TicketMonthFiles.Status]:false ,
        [TicketMonthFiles.NotesAdmin]:NotesAdmin
    },{
        where:{
            [TicketMonthFiles.TicketId]:IdTicket
        }
    })
    return result ;

}
let getinfoTicket = async (idTicket)=>{
    return await TicketMonthDB.findOne({
        where:{
            [TicketMonthFiles.TicketId]:idTicket
        }
    })
}
let updateTicket  = async (data,Iduser)=>{
    let {TicketId} = data ;
    let tickets = await getinfoTicket(TicketId);
    let NotesAdmin = tickets.dataValues[TicketMonthFiles.NotesAdmin];
    delete tickets.dataValues[TicketMonthFiles.NotesAdmin];
    let Note = {type:'Update',UserId:Iduser , Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm") ,oldValue:tickets.dataValues} ;
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    delete data.TicketId ;
    data[TicketMonthFiles.NotesAdmin] = NotesAdmin ;
    let resultUpdate = await TicketMonthDB.update(data,{
        where:{
            [TicketMonthFiles.TicketId]:TicketId
        }
    })
    return resultUpdate ;
}
let  searchTicket = async (Role,Group,data)=>{
    let Sql = `SELECT Ticket.* , Users.UserName, Users.Id,TypeOfTicket.TypeOfTicketName ,Stations.StationsName    FROM Ticket LEFT JOIN Users ON Ticket.CreateByUser =Users.Id LEFT JOIN Stations On Ticket.NameStations=Stations.StationsID  LEFT JOIN TypeOfTicket ON 
    Ticket.TypeOfTicket = TypeOfTicket.TypeOfTicketID where Ticket.Status=1 `;
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    if(data.LicensePlates){
        Sql+= ` and Ticket.LicensePlates= '${data.LicensePlates}'` ;
    }
    if(data.Stations){
        Sql+= ` and Ticket.NameStations= ${data.Stations}` ;
    }
    if(data.DateEnd){
        Sql+= ` and Date(Ticket.DateEnd)= DATE('${data.DateEnd}')` ;
    }
    Sql+= ` ORDER  BY createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let ImportTicket = async(data,IdUser)=>{
    try {
        let listStations =JSON.parse(JSON.stringify( await getListStations()));
        let listTypeoffTicket = JSON.parse(JSON.stringify(await getListTypeOfTicket()));
        console.log(data);
        let ThangQuy  = await sequelize.query('Select * from ThangQuy');
        let dataResult = data.map((item)=>{
        let result = {};
        result[TicketMonthFiles.TypeOfTicket]=listTypeoffTicket[0].TypeOfTicketID;
        result[TicketMonthFiles.NameStations]=listStations[0].StationsID ;
        result[TicketMonthFiles.Money]=item['Giá tiền'];
        result[TicketMonthFiles.DateStart] =  moment(item['Ngày bắt đầu'],"DD/MM/YYYY").format();
        result[TicketMonthFiles.DateEnd] = moment( item['Ngày kết thúc'],"DD/MM/YYYY").format();
        result[TicketMonthFiles.AccountID]=item['Mã tài khoản'];
        result[TicketMonthFiles.Etag]=item['Mã thẻ etag'];
        result[TicketMonthFiles.Agency]=item['Đại lý'];
        result[TicketMonthFiles.LicensePlates]=item['Biển số xe'];
        result[TicketMonthFiles.DateSell]=moment( item['Thời gian bán'],"DD/MM/YYYY HH:mm:ss").format();
        listStations.forEach((itemStations)=>{
            if(itemStations.StationsName.toUpperCase()==item['Trạm/Đoạn'].toUpperCase()){
                result[TicketMonthFiles.NameStations]=itemStations.StationsID ;
            }
        })
        ThangQuy[0].forEach((itemthangquy)=>{
            if(itemthangquy.Rate==item['Giá tiền']){
                item['typeTicket']= itemthangquy.Name ;
            }
        })
        listTypeoffTicket.forEach((itemTicket)=>{
            if(itemTicket.TypeOfTicketName.toUpperCase()==item['typeTicket'].toUpperCase()){
                result[TicketMonthFiles.TypeOfTicket]=itemTicket.TypeOfTicketID;
            }
        })
        
        return result;
    })
    // console.log(dataResult);
    let resut = await createTicket(dataResult[0],IdUser);
    console.log(resut);
    let arrayPromise = dataResult.map((item)=>{
        return createTicket(item,IdUser);
    })
    let resultCreate = await Promise.all(arrayPromise);
    return resultCreate ;
    } catch (error) {
        console.log(error);
        return new Error(error);
    }
    
}
module.exports ={
    getlistTicketMonth,createTicket,deleteTicket ,getListTicketExpired ,
    getinfoTicket,
    updateTicket,
    searchTicket,
    ImportTicket
}