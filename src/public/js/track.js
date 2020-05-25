$(document).ready(function(){
        //Buttons examples
    let table = $('#datatable').DataTable({
        "searching": true,
        paging:true,
        buttons: [
            {
                extend: 'collection',
                text: 'Export',
                buttons: [
                    'copy',
                    'excel',
                    'csv',
                    'pdf',
                    'print'
                ]
            }
        ]
    });

    // Hide message - search
    $(".message-search").hide();
    // DateTime Picker
    document.querySelectorAll('.datetimeinput').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    })
    document.querySelectorAll('.dateinput').flatpickr({
        dateFormat: "Y-m-d",
    })
    $('.add-track').on('click',function(){
        console.log('phong');
       let LicensePlates = $('#LicensePlates').val();
       let NameCustomers = $('#NameCustomers').val();
       let Lane = $('select[name=LaneAdd]').val();
       let Notes = $('#Notes').val();
       let Fee = $('#TypeOfTicketAdd').val();
       let TrackTime = $('#TrackTime').val();
       console.log(LicensePlates , NameCustomers ,Lane,Notes,Fee,TrackTime);
       if(LicensePlates=='' ||TrackTime==''){
        return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
       }
       let data = {};
       data['LicensePlates']=LicensePlates;
       data['NameCustomer']=NameCustomers;
       data['Lane']=Lane;
       data['Notes']=Notes;
       data['TrackFee']=Fee;
       data['TrackTime']=TrackTime;
       console.log(data);
       $.ajax({
        url : "/track/create",
        method:'post',
        data:data,
        success: function(data){
            if(!data.error){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Thêm Thành Công',
                    showConfirmButton: false,
                    timer: 1500
                })
                $('#LicensePlates').val('');
                $('#NameCustomers').val('');
                $('#Notes').val('');
                $('#TrackTime').val('');
                $("#closeModalAdd").click();
                LoadTrack();
            }
        }
       })
      
    })
    function LoadTrack(){
        console.log('Load Track');
        $.ajax({
            url : "/track/getList",
            method:'get',
            success:function(data){
                if(!data.error){
                    console.log(data);
                    let array = data.data.map((item,index)=>{
                        let text= `<tr>  <td>${index+1}</td> 
                        <td>${item.UserName}</td>
                        <td>${item.LicensePlates.toUpperCase()}</td>
                        <td>${item.NameCustomer}</td>
                        <td>${item.Lane}</td>
                        <td>${ moment(item.TrackTime).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")}</td>
                        <td>${item.FeeNumbers}</td>
                        <td>${item.Notes}</td>
                        <td>
                            <div class="btn btn-group-xs">`;
                        if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id=${item.TrackId}><i class="fa fa-pencil"></i> Sửa</button>`}
                        if(item.canDelete){ text+= `<button type="button" class="del btn btn-danger deleteTrack" data-id=${item.TrackId}><i class="fa fa-trash"></i> Xóa</button>`}
                         text+= `
                            </div>
                        </td></tr> `
                        return text ;
                        
                    })
                    let result = array.join('');
                    $("#datatable > tbody").empty();
                    table.clear();
                    table.destroy();
                    $("#datatable> tbody").append(result);
                    table = $('#datatable').DataTable();
                    let totalMoney = 0 ;
                    data.data.forEach((item)=>{
                        totalMoney+= item.FeeNumbers ;
                    })
                    $(".message-search").show();
                    $("#totalmoneys").text(totalMoney);
                    $("#totaltimes").text(data.data.length);
                }
            }
        })
    }
    // Delete Track
    $(document).on('click','.deleteTrack',function(){
        let TrackId= $(this).attr("data-id");
        Swal.fire({
            title: 'Xóa thông tin?',
            text: "Bạn có chắc chắn xóa thông tin này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng Ý ',
            cancelButtonText:'Không'
          }).then((result) => {
            if (result.value) {
                $.ajax({
                    url:'/track/delete',
                    method:'post',
                    data:{'TrackId':TrackId},
                    success:function(data){
                        console.log(data);
                        if(!data.error){
                            Swal.fire(
                                'Thành Công!',
                                'Xóa Thành Công !',
                                'success'
                              )
                              LoadTrack();
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
    // Open Edit Form
    $(document).on('click','.edit',function(){
        
        var id = $(this).data('id');
        $.ajax({
            url : "/track/getInfo",
            method:'post',
            data:{Id:id},
            success:function(data){
                console.log(data);
                $("#LicensePlatesEdit").val(data.data.LicensePlates);
                $("#NameCustomerEdit").val(data.data.NameCustomer);
                $("#LaneEdit").val(data.data.Lane).change();
                $("#TrackTimeEdit").val(moment(data.data.TrackTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm"));
                $("#NotesEdit").val(data.data.Notes);
                $("#FeeEdit").val(data.data.TrackFee).change();
                $("#idTrackEdit").val(data.data.TrackId);
                $('#editForm').modal('toggle');
            }
        })
    })
    // Click UpdateTrack
    $(document).on('click','#UpdateTrack',function(){
        let TrackId= $("#idTrackEdit").val();
        let  LicensePlates =  $("#LicensePlatesEdit").val();
        let NameCustomer = $("#NameCustomerEdit").val();
        let Lane = $("#LaneEdit").val();
        let TrackTime = $("#TrackTimeEdit").val();
        let Notes= $("#NotesEdit").val();
        let TrackFee = $("#FeeEdit").val();
        $.ajax({
            url:'/track/update',
            method:'post',
            data:{TrackId,LicensePlates,NameCustomer,Lane,TrackTime,Notes,TrackFee},
            success:function(data){
                if(!data.error){
                    LoadTrack();
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
    // Click To Edit
    // Search
    $('.btn-search-form').on('click',function(){
        console.log('click');
        let LicensePlates = $('#LicensePlatesSearch').val();
        let DateStart = $('#DateStartSearch').val();
        let DateEnd = $('#DateEndSearch').val();
        let Lane = $('#LaneSearch').val();
        console.log(LicensePlates,DateStart,DateEnd,Lane);
        if(LicensePlates==''&& DateStart=='' && DateEnd==''&& Lane=='all'){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin Khi Tìm Kiếm');
        }
       
        let data = {};
        if(LicensePlates!=''){
            data['LicensePlates']=LicensePlates;
        }
        if(DateStart!=''){
            data['DateStart']=DateStart;
        }
        if(DateEnd!=''){
            data['DateEnd']=DateEnd;
        }
        if(Lane!='all'){
            data['Lane']=Lane;
        }
        $.ajax({
            url:'/track/search',
            method:'post',
            data:data,
            success:function(data){
                console.log(data);
                if(!data.error){
                    if(data.data.length==0){
                        Swal.fire({
                            icon: 'warning',
                            title: 'Oops...',
                            text: 'Không Có Giá trị nào',
                           
                          })
                          return ;
                    }
                    let array = data.data.map((item,index)=>{
                        let text= `<tr>  <td>${index+1}</td> 
                        <td>${item.UserName}</td>
                        <td>${item.LicensePlates.toUpperCase()}</td>
                        <td>${item.NameCustomer}</td>
                        <td>${item.Lane}</td>
                        <td>${ moment(item.TrackTime).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")}</td>
                        <td>${item.FeeNumbers}</td>
                        <td>${item.Notes}</td>
                        <td>
                            <div class="btn btn-group-xs">`;
                        if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id=${item.TrackId}><i class="fa fa-pencil"></i> Sửa</button>`}
                        if(item.canDelete){ text+= `<button type="button" class="del btn btn-danger deleteTrack" data-id=${item.TrackId}><i class="fa fa-trash"></i> Xóa</button>`}
                         text+= `
                            </div>
                        </td></tr> `
                        return text ;
                        
                    })
                   
                    let result = array.join('');
                    $("#datatable > tbody").empty();
                    table.clear();
                    table.destroy();
                    $("#datatable> tbody").append(result);
                    table = $('#datatable').DataTable({ "searching": false});
                    // show message 
                    let totalMoney = 0 ;
                    data.data.forEach((item)=>{
                        totalMoney+= item.FeeNumbers ;
                    })
                    $(".message-search").show();
                    $("#totalmoneys").text(totalMoney);
                    $("#totaltimes").text(data.data.length);
                }
            }
        })
    })
    // Reset Info
    $('.btn-clear-search').on('click',function(){
        $('#LicensePlatesSearch').val('');
        $('#DateStartSearch').val('');
        $('#DateEndSearch').val('');
        LoadTrack();
    })
    // Import Track
    $('#importTrack').change(function(){
        let Fee = [{id:1,fee:0},{id:2,fee:18000},{id:3,fee:20000},{id:4,fee:25000},{id:5,fee:30000},{id:6,fee:45000},{id:7,fee:50000},{id:8,fee:70000},{id:9,fee:75000},{id:10,fee:100000},{id:11,fee:120000},{id:12,fee:180000}];
        var reader = new FileReader();
        reader.onload = function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            result.map(item=>{
                item.fee=1;
                item.time= moment(item['Thời gian']).format("YYYY-MM-DD HH:mm");
                if(item.time=='Invalid date') {item.time="2019-10-05 13:17"} ;
                Fee.forEach(item2=>{if(item2.fee==item['Mệnh giá']) {item.fee=item2.id}})
                return item ;
            })
          
            console.log(moment('22/10/2019 15:43').format("YYYY-MM-DD HH:mm"));
            console.log(result);
            result.map(item=>{
                let data = {};
                data['LicensePlates']=item['Biển số xe'];
                data['NameCustomer']=item['Tên khách hàng'];
                data['Lane']=item['Làn'];
                data['Notes']=' ';
                data['TrackFee']=item.fee;
                data['TrackTime']=item.time;
                $.ajax({
                    url : "/track/create",
                    method:'post',
                    data:data,
                    success: function(data){
                        
                    }
                })
            })
        }
        reader.readAsBinaryString(event.target.files[0]);
    })
    //sugget 
    $("#tracksuggesst").click(function(){
        let LicensePlates = $("#LicensePlates").val();
        console.log(LicensePlates);
        if(LicensePlates==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin Khi Tìm Kiếm');
        }
        $.ajax({
            url : "/track/suggest",
            method:'post',
            data:{
                LicensePlates
            },
            success:function(data){
                console.log(data);
                if(data.data){
                    $("#NameCustomers").val(data.data.NameCustomer);
                    $("select[name=Fee]").val(data.data.TrackFee).change();
                }
            }
        })
    })
})
