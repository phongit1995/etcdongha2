let {OperatingDiaryFileds,OperatingDiaryDB} = require('./../databases/operatingdiary');
let Texthelper = require('./../commons/TextHelper');
let sequelize = require('./../databases/connectdb');
let moment = require('moment-timezone');
let create = async (data,IdUser,Image)=>{
    delete data.FileImages;
    data[OperatingDiaryFileds.CreateByUser]= IdUser ;
    data[OperatingDiaryFileds.OperatingDiaryId] =Texthelper.genId();
    if(Image){
        data[OperatingDiaryFileds.Image]= Image.filename;
    }
    console.log(data);
    let result = await OperatingDiaryDB.create({...data});
    return result ;
}
let getListOperationgDiary = async (Role,Group)=>{
    let Sql = `
    select OperatingDiary.OperatingDiaryId , OperatingDiary.LicensePlates, OperatingDiary.OperatingDiaryTime, OperatingDiary.Lane,OperatingDiary.Image,OperatingDiary.Descriptor,OperatingDiary.Handle,OperatingDiary.Status ,OperatingDiary.Notes , OperatingDiary.NotesAdmin
    ,Lane.LaneName , HandleError.HandleErrorContent, Descriptor.DescriptorContent, Users.Id , Users.UserName 
    from OperatingDiary LEFT JOIN Lane on  OperatingDiary.Lane = Lane.LaneID left join Descriptor on OperatingDiary.
    Descriptor = Descriptor.DescriptorId left join HandleError on OperatingDiary.Handle = HandleError.HandleErrorId left join Users on 
    OperatingDiary.CreateByUser = Users.Id where OperatingDiary.Status =1
    `
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    Sql+= ` ORDER  BY OperatingDiary.createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
let deleteOperatingDiary = async (Id,UserId)=>{
    let ListOperatingDiary = await OperatingDiaryDB.findAll({
        where:{
            [OperatingDiaryFileds.OperatingDiaryId]:Id
        }
    })
    let NotesAdmin= ListOperatingDiary[0].dataValues[OperatingDiaryFileds.NotesAdmin] ;
    let Note ={ type:'Delete',UserId:UserId,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = await OperatingDiaryDB.update({
        [OperatingDiaryFileds.Status]:false,
        [OperatingDiaryFileds.NotesAdmin]:NotesAdmin
    },{
        where:{
            [OperatingDiaryFileds.OperatingDiaryId]:Id
        }
    })
    return result ;
}
let getInfoOperatingDary = async (Id)=>{
    let ListOperatingDiary = await OperatingDiaryDB.findAll({
        where:{
            [OperatingDiaryFileds.OperatingDiaryId]:Id
        }
    })
    return ListOperatingDiary[0];
}
let updateOperatingDiary = async(data,UserId, Image)=>{
    delete data.FileImages;
    let IDOperatingDiary = data[OperatingDiaryFileds.OperatingDiaryId];
    if(Image){
        data[OperatingDiaryFileds.Image]= Image.filename ;
    }
    let InfoOperatingDary  = await getInfoOperatingDary(IDOperatingDiary);
    let NotesAdmin = InfoOperatingDary.dataValues[OperatingDiaryFileds.NotesAdmin];
    delete InfoOperatingDary.dataValues[OperatingDiaryFileds.NotesAdmin];
    let Note = {type:'Update',UserId:UserId , Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm") ,oldValue:InfoOperatingDary.dataValues} ;
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    delete data[OperatingDiaryFileds.OperatingDiaryId];
    data[OperatingDiaryFileds.NotesAdmin] = NotesAdmin ;
    console.log(data);
    let resultUpdate = await OperatingDiaryDB.update({
        ...data
    },{
        where:{
            [OperatingDiaryFileds.OperatingDiaryId]:IDOperatingDiary
        }
    })
    return resultUpdate ;
}
let searchOperatingDiary = async (Role,Group,data)=>{
    let Sql = `
    select OperatingDiary.OperatingDiaryId , OperatingDiary.LicensePlates, OperatingDiary.OperatingDiaryTime, OperatingDiary.Lane,OperatingDiary.Image,OperatingDiary.Descriptor,OperatingDiary.Handle,OperatingDiary.Status ,OperatingDiary.Notes , OperatingDiary.NotesAdmin
    ,Lane.LaneName , HandleError.HandleErrorContent, Descriptor.DescriptorContent, Users.Id , Users.UserName 
    from OperatingDiary LEFT JOIN Lane on  OperatingDiary.Lane = Lane.LaneID left join Descriptor on OperatingDiary.
    Descriptor = Descriptor.DescriptorId left join HandleError on OperatingDiary.Handle = HandleError.HandleErrorId left join Users on 
    OperatingDiary.CreateByUser = Users.Id where OperatingDiary.Status =1
    `
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    if(data.LicensePlates){
        Sql+= ` and LicensePlates= '${data.LicensePlates}'`
    }
    if(data.DateStart){
        Sql+= ` and  DATE_FORMAT(OperatingDiaryTime,'%Y-%m-%d') >= '${data.DateStart}'`
    }
    if(data.DateEnd){
        Sql+= ` and DATE_FORMAT(OperatingDiaryTime,'%Y-%m-%d') <= '${data.DateEnd}'`
    }
    if(data.Lane){
        Sql+= ` and OperatingDiary.Lane= ${data.Lane} `
    }

    Sql+= ` ORDER  BY OperatingDiary.createdAt DESC` ;
    return await sequelize.query(Sql) ;
}
module.exports = {
    create,getListOperationgDiary,deleteOperatingDiary,getInfoOperatingDary,updateOperatingDiary,searchOperatingDiary
}