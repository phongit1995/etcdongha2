let {getListTicketExpired}  = require('./../models/ticket');
let {getNotificationTrack} = require('./../models/track');
const EXPRIEDDAYS = 3 ;
const TRACKDAYNOTIFICATION =1 ;
let getNotifiCation= async (req)=>{
   return await Promise.all([notifiCationSTicketExpried(req),notificationsTrack(req)]);
}

let notifiCationSTicketExpried = async (req)=>{
    let {Role,Group,Id} = req.user ;
    let listTicket = await getListTicketExpired(Role,Group,EXPRIEDDAYS);
    return {
        number:listTicket[0].length,
        link:"/ticketmonth",
        message:`Bạn Có ${listTicket[0].length} vé tháng sắp hết hạn`
    }
}
let notificationsTrack = async (req)=>{
    let {Role,Group,Id} = req.user ;
    let listTrackNotification = await getNotificationTrack(Role,Group,Id,TRACKDAYNOTIFICATION);
    if(Role==1){
        return {
            number:listTrackNotification[0].length,
            link:"/track",
            message:`Tổng Hôm Qua Nhập Được ${listTrackNotification[0].length} vượt trạm`
        }
    }
    if(Role==2){
        return {
            number:listTrackNotification[0].length,
            link:"/track",
            message:`Nhóm Bạn Hôm Qua Nhập Được ${listTrackNotification[0].length} vượt trạm`
        }
    }
    if(Role==3){
        return {
            number:listTrackNotification[0].length,
            link:"/track",
            message:` Bạn Hôm Qua Nhập Được ${listTrackNotification[0].length} giảm giá`
        }
    }
    // console.log(listTrackNotification);
    
}
module.exports = getNotifiCation ;