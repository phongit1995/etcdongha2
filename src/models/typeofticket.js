let {TypeOfTicketDB,TypeOfTicketFields} = require('./../databases/typeofticket');
let Texthelper = require('./../commons/TextHelper');
let getListTypeOfTicket = async ()=>{
    return await TypeOfTicketDB.findAll();
}

module.exports = {
    getListTypeOfTicket
}