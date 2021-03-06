let {SaleOffFields,SaleOffDB} = require('./../databases/saleoff');
let Texthelper = require('./../commons/TextHelper');
let sequelize = require('./../databases/connectdb');
let moment = require('moment-timezone');
let create = async (data,user,Image)=>{
    delete data.FileImages;
    if(user.Role!=1){
        data[SaleOffFields.ForUser]=user.Id;
    }
    data[SaleOffFields.CreateByUser] = user.Id;
    data[SaleOffFields.SaleOffID]= Texthelper.genId();
    if(Image){
        data[SaleOffFields.SaleoffImage] =  Image.filename ;
    }
    console.log(data);
    // console.log(data);
    // console.log(data);
    let result = await SaleOffDB.create({...data});
    return result ;
}
let GetListSaleOff = async (Role,Id)=>{
    let Sql= `select SaleOff.SaleOffID ,SaleOff.LicensePlates, SaleOff.NameCustomer, SaleOff.CreateByUser , SaleOff.
        Image , SaleOff.DateStart , SaleOff.DateEnd, SaleOff.Notes, users.UserName as ForUserName ,SaleOff.StatusPro ,
        SaleOff.TrackingNo ,SaleOff.AddVn , SaleOff.PhoneVn ,   SaleOff.AddJp ,   SaleOff.PhoneJp ,SaleOff.Notting ,SaleOff.NameProduct ,SaleOff.QtyPro ,SaleOff.RatePro  ,SaleOff.ForUser,SaleOff.TickMoney , SaleOff.DateDeli , SaleOff.SaleoffImage ,           
        TypeOfSaleOff.TypeOfSaleOffID , TypeOfSaleOff.TypeOfSaleOffName, Denominations.DenominationsID , Denominations.DenominationsNumbers, Users.UserName,Users.Id from SaleOff  LEFT JOIN TypeOfSaleOff on SaleOff.TypeOfSaleOff = TypeOfSaleOff.TypeOfSaleOffID LEFT JOIN Users on SaleOff.CreateByUser = Users.Id LEFT JOIN 
        Denominations on SaleOff.Denominations = Denominations.DenominationsID  LEFT JOIN Users users on  SaleOff.ForUser= users.Id where SaleOff.Status =1`
        if(Role!=1){
            Sql+= ` and SaleOff.ForUser= ${Id}`
        }
        Sql+= ` ORDER  BY SaleOff.createdAt DESC` ;
        return await sequelize.query(Sql) ;
}
let deleteSaleoff = async (data,IdUser)=>{
    let SaleoffList = await SaleOffDB.findAll({
        where:{
            [SaleOffFields.SaleOffID]:data.SaleOffId
        }
    })
    let NotesAdmin= SaleoffList[0].dataValues[SaleOffFields.NotesAdmin] ;
    let Note ={ type:'Delete',UserId:IdUser,Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")};
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    let result = await SaleOffDB.update({
        [SaleOffFields.Status]:false,
        [SaleOffFields.NotesAdmin]:NotesAdmin
    },{
        where:{
            [SaleOffFields.SaleOffID]:data.SaleOffId
        }
    })
    return result ;
}
let GetInfoSaleOff = async (Id)=>{
    let Sql= `select SaleOff.SaleOffID ,SaleOff.LicensePlates, SaleOff.NameCustomer, SaleOff.CreateByUser , SaleOff.
        Image , SaleOff.DateStart , SaleOff.DateEnd, SaleOff.Notes, users.UserName as ForUserName ,SaleOff.StatusPro ,
        SaleOff.TrackingNo ,SaleOff.AddVn , SaleOff.PhoneVn ,   SaleOff.AddJp ,   SaleOff.PhoneJp ,SaleOff.Notting ,SaleOff.NameProduct ,SaleOff.QtyPro ,SaleOff.RatePro  ,SaleOff.ForUser,SaleOff.TickMoney , SaleOff.DateDeli , SaleOff.SaleoffImage ,           
        TypeOfSaleOff.TypeOfSaleOffID , TypeOfSaleOff.TypeOfSaleOffName, Denominations.DenominationsID , Denominations.DenominationsNumbers, Users.UserName,Users.Id from SaleOff  LEFT JOIN TypeOfSaleOff on SaleOff.TypeOfSaleOff = TypeOfSaleOff.TypeOfSaleOffID LEFT JOIN Users on SaleOff.CreateByUser = Users.Id LEFT JOIN 
        Denominations on SaleOff.Denominations = Denominations.DenominationsID  LEFT JOIN Users users on  SaleOff.ForUser= users.Id where SaleOff.Status =1`

        Sql+= ` and SaleOff.SaleOffID=${Id}` ;
        return await sequelize.query(Sql,{raw:true}) ;
}
let updateSaleOff = async (data,IdUser,Image)=>{
    delete data.FileImages;
    let IdSaleOff = data[SaleOffFields.SaleOffID];
    if(Image){
        data[SaleOffFields.SaleoffImage] = Image.filename ;
    }
    let SaleOff = await GetInfoSaleOff(IdSaleOff);
    console.log(SaleOff);
    let NotesAdmin = SaleOff[SaleOffFields.NotesAdmin];
    delete SaleOff[SaleOffFields.NotesAdmin];
    let Note = {type:'UpdateSaleOff',UserId:IdUser , Time:moment().tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm") ,oldValue:SaleOff} ;
    if(!NotesAdmin){ NotesAdmin=[] ; NotesAdmin.push(Note) }else{
        NotesAdmin= JSON.parse(NotesAdmin);
        NotesAdmin.push(Note)
    }
    delete data[SaleOffFields.SaleOffID];
    data[SaleOffFields.NotesAdmin] = NotesAdmin;
    console.log(data);
    let resultUpdate = await SaleOffDB.update(data,{
        where:{
            [SaleOffFields.SaleOffID]:IdSaleOff
        }
    })
    return resultUpdate ;
}
let searchSaleoff = async (Role,Group,data)=>{
    let Sql= `select SaleOff.SaleOffID ,SaleOff.LicensePlates, SaleOff.NameCustomer, SaleOff.CreateByUser , SaleOff.
    Image , SaleOff.DateStart , SaleOff.DateEnd, SaleOff.Notes, TypeOfSaleOff.TypeOfSaleOffID , TypeOfSaleOff.TypeOfSaleOffName, Denominations.DenominationsID , Denominations.DenominationsNumbers, Users.UserName,Users.Id from SaleOff  LEFT JOIN TypeOfSaleOff on SaleOff.TypeOfSaleOff = TypeOfSaleOff.TypeOfSaleOffID LEFT JOIN Users on SaleOff.CreateByUser = Users.Id LEFT JOIN 
    Denominations on SaleOff.Denominations = Denominations.DenominationsID where SaleOff.Status =1`
    if(Role!=1){
        Sql+= ` and Users.Group= ${Group}`
    }
    if(data.LicensePlates){
        Sql+= ` and SaleOff.LicensePlates= '${data.LicensePlates}'`
    }
    if(data.DateStart){
        Sql+= ` and  DATE_FORMAT(SaleOff.DateStart,'%Y-%m-%d') >= '${data.DateStart}'`
    }
    if(data.DateEnd){
        Sql+= ` and DATE_FORMAT(SaleOff.DateStart,'%Y-%m-%d') <= '${data.DateEnd}'`
    }
    if(data.TypeOffSaleOff){
        Sql+= ` and SaleOff.TypeOfSaleOff = ${data.TypeOffSaleOff}` ;
    }
    Sql+= ` ORDER  BY SaleOff.createdAt DESC , StatusPro DESC` ;
    return await sequelize.query(Sql) ;
}
module.exports= {
    create ,GetListSaleOff ,deleteSaleoff,GetInfoSaleOff,updateSaleOff,searchSaleoff
}