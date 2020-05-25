$(document).ready(function(){
    let table = $('#datatable').DataTable({
        "searching": false
    });
    document.querySelectorAll('.dateinput').flatpickr({
        dateFormat: "Y-m-d",
        defaultDate:new Date()
    })
    document.querySelectorAll('.dateinputSearch').flatpickr({
        dateFormat: "Y-m-d"
    })
    $('#AddTicket').click(function(){
        let LicensePlates = $('#LicensePlatesName').val();
        let MoneyAdd = $("#MoneyAdd").val();
        let TypeOfTicketAdd = $("#TypeOfTicketAdd").val();
        let StationsAdd = $("#StationsAdd").val();
        let dateStartAdd = $("#dateStartAdd").val();
        let dateEndAdd = $("#dateEndAdd").val();
        let NotesAdd = $("#NotesAdd").val();
        console.log(LicensePlates  ,MoneyAdd ,TypeOfTicketAdd ,StationsAdd,dateStartAdd ,dateEndAdd,NotesAdd );
        if(LicensePlates=='' && MoneyAdd==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        $.ajax({
            url:"/ticketmonth/create",
            method:"post",
            data:{
                LicensePlates:LicensePlates,
                NameStations:StationsAdd,
                TypeOfTicket:TypeOfTicketAdd,
                Money:MoneyAdd,
                DateStart:dateStartAdd,
                DateEnd:dateEndAdd,
                Notes:NotesAdd
            },
            success:function(data){
                if(!data.error){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Thêm Thành Công',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    $('#LicensePlatesName').val('');
                    $('#MoneyAdd').val('');
                    $('#NotesAdd').val('');
                    LoadListTicket();
                }
            }
        })
    })
    $(document).on('click','.deleteTicket',function(){
        let TicketId= $(this).attr("data-id");
        Swal.fire({
            title: 'Xóa Thông Tin?',
            text: "Bạn Có Chắc Chắn Xóa Thông Tin này không!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng Ý ',
            cancelButtonText:'Không'
          }).then((result) => {
            if (result.value) {
                $.ajax({
                    url:'/ticketmonth/delete',
                    method:'post',
                    data:{'TicketId':TicketId},
                    success:function(data){
                        console.log(data);
                        if(!data.error){
                            Swal.fire(
                                'Thành Công!',
                                'Xóa Thành Công !',
                                'success'
                              )
                              LoadListTicket();
                        }
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Đã Có Lỗi Xảy Ra!',
                                
                              })
                        }}
                })
                
            }
        })
    })
    // Reload List

    function LoadListTicket (){
        $.ajax({
            method:'get',
            url:'/ticketmonth/getlist',
            success:function(data){
                console.log(data);
                let array = data.data.map((item,index)=>{
                    let notes ;
                    if(item.Notes==null|| item.Notes=='null'){
                        notes='';
                    }
                    else {
                        notes = item.Notes ;
                    }

                    let text = `
                    <tr role="row" class="odd"> <td class="sorting_1">${index+1}</td> 
                    <td>${item.LicensePlates}</td>
                    <td>${item.StationsName}</td> 
                    <td>${item.TypeOfTicketName}</td> 
                    <td>${item.Money}</td> 
                    <td>${moment(item.DateStart).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td> 
                    <td>${moment(item.DateEnd).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td> 
                    <td>${notes}</td> 
                    <td width="5%"> 
                    <div class="btn btn-group-xs"> `;
                    if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id="${item.TicketId}"><i class="fa fa-pencil"></i> Sửa</button>`}
                    if(item.canDelete){text += ` <button type="button" class="del btn btn-danger deleteTicket" data-id="${item.TicketId}"><i class="fa fa-trash"></i> Xóa</button>`}      
                           
                    text += ` </div> 
                      </td> 
                      </tr>
                    `
                    return text ;
                })
                let result = array.join('');
                // console.log(result);
                    $("#datatable > tbody").empty();
                    table.clear();
                    table.destroy();
                    $("#datatable> tbody").append(result);
                    table = $('#datatable').DataTable();
            }
        })
    }
    // Click Edit 
    $(document).on('click',".edit",function(){
        let id = $(this).data("id");
        $.ajax({
            url:'/ticketmonth/getinfo',
            method:'post',
            data:{
                id:id
            },
            success:function(data){
                console.log(data);
                $("#LicensePlatesNameEdit").val(data.data.LicensePlates);
                $("#TypeOfTicketEdit").val(data.data.TypeOfTicket).change();
                $("#MoneyEdit").val(data.data.Money) ;
                $("#StationsEdit").val(data.data.NameStations).change();
                $("#dateStartEdit").val( moment(data.data.DateStart).tz("Asia/Bangkok").format("YYYY-MM-DD"));
                $("#dateEndEdit").val(moment(data.data.DateEnd).tz("Asia/Bangkok").format("YYYY-MM-DD"));
                $("#NotesEdit").val(data.data.Notes);
                $("#idTicketEdit").val(data.data.TicketId);
                $("#editForm").modal('toggle');
            }
        })
       
    })
    $(".saveEdit").click(function(){
        let LicensePlatesNameEdit = $("#LicensePlatesNameEdit").val();
        let TypeOfTicketEdit =  $("#TypeOfTicketEdit").val() ;
        let MoneyEdit = $("#MoneyEdit").val() ;
        let StationsEdit = $("#StationsEdit").val();
        let dateStartEdit = $("#dateStartEdit").val( );
        let dateEndEdit = $("#dateEndEdit").val();
        let NotesEdit = $("#NotesEdit").val();
        let idTicketEdit = $("#idTicketEdit").val();
        if(LicensePlatesNameEdit=='' && MoneyEdit==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        $.ajax({
            url:"/ticketmonth/updateticket",
            method:"post",
            data:{
                TicketId:idTicketEdit,
                LicensePlates:LicensePlatesNameEdit,
                NameStations:StationsEdit,
                TypeOfTicket:TypeOfTicketEdit,
                Money:MoneyEdit,
                DateStart:dateStartEdit,
                DateEnd:dateEndEdit,
                Notes:NotesEdit
            },
            success:function(data){
                if(!data.error){
                    LoadListTicket();
                    $('#editForm').modal('hide');
                    Swal.fire(
                        'Thành Công!',
                        'Cập Nhật Thông Tin Thành Công!',
                        'success'
                      )
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Đã Có Lỗi Xảy Ra!',
                        
                      })
                }
                
            }
        })
    })
    $(".btn-search-form").click(function(){
        let LicensePlatesSearch = $("#LicensePlatesSearch").val();
        let StationsSearch = $("#StationsSearch").val();
        let DateEndSearch = $("#DateEndSearch").val();
        let data={};
        if(LicensePlatesSearch!=''){
            data.LicensePlates= LicensePlatesSearch ;
        }
        if(StationsSearch!='all'){
            data.Stations= StationsSearch ;
        }
        if(DateEndSearch!=''){
            data.DateEnd= DateEndSearch ;
        }
        console.log(data);
        $.ajax({
            url:'/ticketmonth/search',
            method:'post',
            data:data,
            success:function(data){
                console.log(data);
                let array = data.data.map((item,index)=>{
                    let notes ;
                    if(item.Notes=='null'){
                        notes='';
                    }
                    else {
                        notes = item.Notes ;
                    }
                    let text = `
                    <tr role="row" class="odd"> <td class="sorting_1">${index+1}</td> 
                    <td>${item.LicensePlates}</td>
                    <td>${item.StationsName}</td> 
                    <td>${item.TypeOfTicketName}</td> 
                    <td>${item.Money}</td> 
                    <td>${moment(item.DateStart).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td> 
                    <td>${moment(item.DateEnd).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td> 
                    <td>${notes}</td> 
                    <td width="5%"> 
                    <div class="btn btn-group-xs"> `;
                    if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id="${item.TicketId}"><i class="fa fa-pencil"></i> Sửa</button>`}
                    if(item.canDelete){text += ` <button type="button" class="del btn btn-danger deleteTicket" data-id="${item.TicketId}"><i class="fa fa-trash"></i> Xóa</button>`}      
                           
                    text += ` </div> 
                      </td> 
                      </tr>
                    `
                    return text ;
                })
                let result = array.join('');
                console.log(result);
                $("#datatable > tbody").empty();
                table.clear();
                table.destroy();
                $("#datatable> tbody").append(result);
                table = $('#datatable').DataTable();
            }
        })
    })
    $(".btn-clear-search").click(function(){
        $("#LicensePlatesSearch").val('');
        $("#StationsSearch").val('all').change();
        $("#DateEndSearch").val('');
        LoadListTicket();
    })
    // Import Ticket 
    $("#importTicket").change(function(){
        var reader = new FileReader();
        reader.onload = function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
           console.log(result);
           $.ajax({
               url:"/ticketmonth/import",
               method:"post",
               data:{data:result},
               success:function(data){
                    console.log(data);
                    if(!data.error){
                        Swal.fire(
                            'Thành Công!',
                            'Import Ticket Thành Công !',
                            'success'
                          )
                          LoadListTicket();
                    }else 
                    {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Đã Có Lỗi Xảy Ra!',
                            
                          })
                    }
               }
           })
        }
        reader.readAsBinaryString(event.target.files[0]);
    })
})