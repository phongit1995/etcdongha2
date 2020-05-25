

$(document).ready(function(){
    document.querySelectorAll('.datetimeinput').flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    })
    const URLIMAGES = 'http://wooeu.net/home/uploads/';
    let table = $('#datatable').DataTable();
    document.querySelectorAll('.dateinput').flatpickr({
        enableTime: false,
        dateFormat: "Y-m-d",
    })
    $('.add-operatingdiary').on('click',function(){
        console.log('add operatingdiary');
        let LicensePlates = $('#LicensePlates').val();
        let Lane = $('#Lane').val();
        let OperatingDiaryTime = $('#OperatingDiaryTime').val();
        let Descriptor = $('#Descriptor').val();
        let HandeError = $('#HandeError').val();
        let Notes = $('#Notes').val();
        let File = $('#Image')[0].files[0];
        console.log(LicensePlates,OperatingDiaryTime);
        if(LicensePlates=='' || OperatingDiaryTime==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('LicensePlates',LicensePlates);
        formData.append('Lane',Lane);
        formData.append('Descriptor',Descriptor);
        formData.append('Handle',HandeError);
        formData.append('Notes',Notes);
        formData.append('OperatingDiaryTime',OperatingDiaryTime);
        formData.append('FileImages',File);
        $.ajax({
            url:'/operatingdiary/create',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                console.log(data);
                if(!data.error){
                    loadOperatingdiary();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Thêm Thành Công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    ClearInput();
                   
                }
            }
        })
    })
    // On change Image
    $('#Image').change(function(){
        console.log('change file');
        console.log(this.files[0]);
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                let img =`<img src=${e.target.result} class='image-preview'/>`;
                $('#image-priview-add').empty();
                $('#image-priview-add').append(img);
            }
            reader.readAsDataURL(this.files[0]);
        }
    })
    // Clear Input 
    function ClearInput(){
        $('#LicensePlates').val('');
        $('#OperatingDiaryTime').val('');
        $('#Notes').val(' ');
        $('#Image').val(null);
        $('#image-priview-add').empty();
    }
    // Load Table 
    function loadOperatingdiary(){
        console.log('Table');
        $.ajax({
            url:'/operatingdiary/getlist',
            method:'post',
            success:function(data){
                if(!data.error){
                    console.log(data);
                    let array = data.data.map((item,index)=>{
                        let text = `
                        <tr>
                        <td>${index+1 }</td>
                        <td>${item.UserName }</td>
                        <td>${item.LicensePlates }</td>
                        <td>${item.LaneName }</td>
                        <td>${moment(item.OperatingDiaryTime).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")  }</td>
                        <td>${item.DescriptorContent }</td>
                        <td>${item.HandleErrorContent }</td>
                        <td>${item.Notes }</td>
                        <td><i class="fa fa-eye show-image"  data-link="${item.Image}"></i></td>
                        <td>
                            <div class="btn btn-group-xs"> ` ;
                            if(item.canEdit){ text +=`<button type="button" class="edit btn btn-success" data-id= ${item.OperatingDiaryId } ><i class="fa fa-pencil"></i> Sửa</button>` }
                             if(item.canDelete){text +=` <button type="button" class="del btn btn-danger deleteOperatingDiary" data-id= ${item.OperatingDiaryId } ><i class="fa fa-trash"></i> Xóa</button>` }    
                                   
                           

                            text+=` </div>
                        </td>
                    </tr>
                        `
                        return text ;
                    })
                    let result = array.join('');
                    $("#datatable > tbody").empty();
                    table.clear();
                    table.destroy();
                    $("#datatable> tbody").append(result);
                    table = $('#datatable').DataTable();
                }
            }
        })
    }
    //  deleteOperatingDiary
    $(document).on('click','.deleteOperatingDiary',function(){
        let OperatingDiary= $(this).attr("data-id");
        console.log(OperatingDiary);
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
                    url:'/operatingdiary/delete',
                    method:'post',
                    data:{OperatingDiaryId:OperatingDiary},
                    success:function(data){
                        console.log(data);
                        if(!data.error){
                            Swal.fire(
                                'Thành Công!',
                                'Xóa Thành Công !',
                                'success'
                              )
                              loadOperatingdiary();
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
    // open Edit Form 
    $(document).on('click','.edit',function(){
        let id = $(this).data('id');
        $.ajax({
            url : "/operatingdiary/getInfo",
            method:'post',
            data:{OperatingDiaryId:id},
            success:function(data){
                if(!data.error){
                    console.log(data);
                    $("#LicensePlatesEdit").val(data.data.LicensePlates);
                    $("#LaneEdit").val(data.data.Lane).change();
                    $("#DescriptorEdit").val(data.data.Descriptor).change();
                    $("#OperatingDiaryTimeEdit").val(moment(data.data.OperatingDiaryTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm"));
                    $('#HandleEdit').val(data.data.Handle).change();
                    $("#NotesEdit").val(data.data.Notes);
                    $('#image-priview-edit').empty();
                    $('#idOperatingDiary').val(data.data.OperatingDiaryId);
                    if(data.data.Image){
                        let img =`<img src="${URLIMAGES+data.data.Image}" class='image-preview'/>`;
                     
                        $('#image-priview-edit').append(img);
                    }
                    $('#editForm').modal('toggle');
                }
               
            }
        })
    })
    $('#ImageEdit').change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
            
                let img =`<img src=${e.target.result} class='image-preview'/>`;
                $('#image-priview-edit').empty();
                $('#image-priview-edit').append(img);
            }
            reader.readAsDataURL(this.files[0]);
        }
    })
    $(document).on('click','#OperatingDiaryUpdate',function(){
        console.log('update');
        let IdOperatingDiary =  $('#idOperatingDiary').val();
        let LicensePlates = $("#LicensePlatesEdit").val();
        let Lane = $("#LaneEdit").val();
        let Descriptor =  $("#DescriptorEdit").val();
        let OperatingDiaryTime = $("#OperatingDiaryTimeEdit").val();
        let Handle = $('#HandleEdit').val();
        let Notes = $("#NotesEdit").val();
        let Files = $('#ImageEdit')[0].files[0];
        if(LicensePlates=='' || OperatingDiaryTime==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('OperatingDiaryId',IdOperatingDiary);
        formData.append('LicensePlates',LicensePlates);
        formData.append('Lane',Lane);
        formData.append('Descriptor',Descriptor);
        formData.append('Handle',Handle);
        formData.append('Notes',Notes);
        formData.append('OperatingDiaryTime',OperatingDiaryTime);
        formData.append('FileImages',Files);
        $.ajax({
            url:'/operatingdiary/update',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                if(!data.error){
                    loadOperatingdiary();
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
     // Open Show Image
     $(".closepup").on('click',function(){
        console.log('click');
        var imageshow = document.getElementById("imageshow");
        imageshow.classList.add("hide");
    })
    $('.popup-iamge').click(function(e){
        
        if(e.target != this) return;
        console.log('click');
        var imageshow = document.getElementById("imageshow");
        imageshow.classList.add("hide");
    });
    $(document).on('click','.show-image',function(){
        let link =  $(this).attr("data-link");
        if(!link || link=='null'){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Chưa Có Hình Ảnh Nào!',
              })
        }else{
            let imageshow = document.getElementById("imageshow");
            imageshow.classList.remove("hide");
            let Imagesshows = document.querySelector('#imageshow > div.popup-iamge > div > img');
            Imagesshows.src = `${URLIMAGES+link}`;
            let linkimageshow = document.querySelector('#imageshow > div.popup-iamge > a');
            // linkimageshow.href = `/images/operatingdiaryimages/${link}`;
        }
    })
    // End toogle form
    // Click search
    $('.btn-search-form').on('click',function(){
        console.log('click');
        let LicensePlates = $('#LicensePlatesSearch').val();
        let DateStart = $('#DateStartSearch').val();
        let DateEnd = $('#DateEndSearch').val();
        let Lane = $('#LaneSearch').val();
        console.log(LicensePlates,DateStart,DateEnd);
        if(LicensePlates==''&& DateStart=='' && DateEnd=='' && Lane=='all'){
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
            url:'/operatingdiary/search',
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
                        let text = `
                        <tr>
                        <td>${index+1 }</td>
                        <td>${item.UserName }</td>
                        <td>${item.LicensePlates }</td>
                        <td>${item.LaneName }</td>
                        <td>${moment(item.OperatingDiaryTime).tz("Asia/Bangkok").format("DD-MM-YYYY HH:mm")  }</td>
                        <td>${item.DescriptorContent }</td>
                        <td>${item.HandleErrorContent }</td>
                        <td>${item.Notes }</td>
                        <td><i class="fa fa-eye show-image"  data-link="${item.Image}"></i></td>
                        <td>
                            <div class="btn btn-group-xs"> ` ;
                            if(item.canEdit){ text +=`<button type="button" class="edit btn btn-success" data-id= ${item.OperatingDiaryId } ><i class="fa fa-pencil"></i> Sửa</button>` }
                             if(item.canDelete){text +=` <button type="button" class="del btn btn-danger deleteOperatingDiary" data-id= ${item.OperatingDiaryId } ><i class="fa fa-trash"></i> Xóa</button>` }    
                                   
                           

                            text+=` </div>
                        </td>
                    </tr>
                        `
                        return text ;
                    })
                    let result = array.join('');
                    $("#datatable > tbody").empty();
                    table.clear();
                    table.destroy();
                    $("#datatable> tbody").append(result);
                    table = $('#datatable').DataTable({ "searching": false});
                }
            }
        })
    })
    // clear search
    $('.btn-clear-search').on('click',function(){
        $('#LicensePlatesSearch').val('');
        $('#DateStartSearch').val('');
        $('#DateEndSearch').val('');
        $('#LaneSearch').val('all').change();
        loadOperatingdiary();
    })
})