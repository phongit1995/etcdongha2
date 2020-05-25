let {TrackFields, TrackDB} = require('./../databases/track');
let sequelize = require('./../databases/connectdb');
const Sequelize = require('sequelize');
let Texthelper = require('./../commons/TextHelper');
let moment = require('moment-timezone');
const NUMBER_LIMIT =100 ;
let create = async (data,IDUser)=>{
    data[TrackFields.CreateByUser]=IDUser;
    data[TrackFields.TrackId] = Texthelper.genId();
    let Track = await TrackDB.create(data);
    return Track ;
}
let getListTrack = async (Role,Group)=>{
    let Sql=`select TrackId,LicensePlates,NameCustomer,Lane,TrackTime,CreateByUser ,Image , Track.Status ,Notes , Track.createdAt,Track.
    updatedAt , Users.UserName, Users.Id ,Fees.IdFee , Fees.FeeNumbers from Track left join Lane on Track.Lane= Lane.LaneID left join Users on Track.CreateByUser = Users.Id  
    left join Fees on Track.TrackFee = Fees.IdFee where Track.Status=1`
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    Sql+= ` ORDER  BY createdAt DESC LIMIT ${NUMBER_LIMIT}` ;
    return await sequelize.query(Sql) ;
}
let DeleteTrack = async (data,Id)=>{
    
    let TrackList = await TrackDB.findAll({
        where:{
            [TrackFields.TrackId]:data.TrackId
        }
    });
    let NotesAdmin= TrackList[0].dataValues[TrackFields.NotesAdmin] ;
    let Note ={ type:'Delete',UserId:Id,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = await TrackDB.update({
        [TrackFields.Status]:false,
        [TrackFields.NotesAdmin]:NotesAdmin
    },{
        where:{[TrackFields.TrackId]:data.TrackId}
    })
    return result ;
    
}
let GetInfoTrack = async (Id)=>{
    let TrackList = await TrackDB.findAll({
        where:{
            [TrackFields.TrackId]:Id
        }
    });
    return TrackList[0];
}
let updateTrack = async(data,Id)=>{
    let IdTrack = data[TrackFields.TrackId];
    let track = await GetInfoTrack(data[TrackFields.TrackId]);
    let NotesAdmin = track.dataValues[TrackFields.NotesAdmin];
    delete track.dataValues[TrackFields.NotesAdmin];
    let Note = {type:'Update Track',UserId:Id , Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm") ,oldValue:track.dataValues} ;
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    delete data[TrackFields.TrackId];
    data[TrackFields.NotesAdmin]= NotesAdmin;
    let resultUpdate = await TrackDB.update(data,
        {
            where:{[TrackFields.TrackId]:IdTrack}
        }
    )
    return resultUpdate ;
}
let searchTrack = async(Role,Group,data)=>{
    let Sql=`select TrackId,LicensePlates,NameCustomer,Lane,TrackTime,CreateByUser ,Image , Track.Status ,Notes , Track.createdAt,Track.
    updatedAt , Users.UserName, Users.Id ,Fees.IdFee , Fees.FeeNumbers from Track left join Lane on Track.Lane= Lane.LaneID left join Users on Track.CreateByUser = Users.Id  
    left join Fees on Track.TrackFee = Fees.IdFee where Track.Status=1`
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    if(data.LicensePlates){
        Sql+= ` and LOWER(LicensePlates)= LOWER('${data.LicensePlates}')`
    }
    if(data.DateStart){
        Sql+= ` and  DATE_FORMAT(TrackTime,'%Y-%m-%d') >= '${data.DateStart}'`
    }
    if(data.DateEnd){
        Sql+= ` and DATE_FORMAT(TrackTime,'%Y-%m-%d') <= '${data.DateEnd}'`
    }
    if(data.Lane){
        Sql+= ` and Track.Lane = ${data.Lane}`
    }
    Sql+= ` ORDER  BY createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let getNotificationTrack = async (Role,Group,IDUser,day)=>{
    let Sql=`select TrackId,LicensePlates,NameCustomer,Lane,TrackTime,CreateByUser ,Image , Track.Status ,Notes , Track.createdAt,Track.
    updatedAt , Users.UserName, Users.Id ,Fees.IdFee , Fees.FeeNumbers from Track left join Lane on Track.Lane= Lane.LaneID left join Users on Track.CreateByUser = Users.Id  
    left join Fees on Track.TrackFee = Fees.IdFee where Track.Status=1 and DATE(Track.createdAt) = DATE(DATE_SUB(NOW(),INTERVAL ${day} DAY))`
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    if(Role==3){
        Sql+= ` and Users.Id= ${IDUser}` ;
    }
    Sql+= ` ORDER  BY createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let suggestTrack = async (id)=>{
    return await TrackDB.findOne({
        where:
            sequelize.where(sequelize.fn('lower', sequelize.col(TrackFields.LicensePlates)),sequelize.fn('lower', id))
        ,
        order:[
            ['createdAt','DESC']
        ]
    })
}
module.exports = {
    create,getListTrack,DeleteTrack,GetInfoTrack,updateTrack,searchTrack,
    getNotificationTrack,
    suggestTrack
}