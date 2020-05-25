$(document).ready(function(){
    const URLIMAGES = 'http://wooeu.net/home/uploads/';
    let table = $('#datatable').DataTable({
        "searching": false
    });
    document.querySelectorAll('.dateinput').flatpickr({
        enableTime: false,
        dateFormat: "Y-m-d",
    })
    // Add Sale Off
    $(".add-saleoff").on('click',function(){
        console.log('add saleoff');
        let LicensePlates = $('#LicensePlates').val();
        let TypeOfSaleOff = $('#TypeOffSaleOff').val();
        let Denominations = $('#Denominations').val();
        let DateStart = $('#DateStart').val();
        let DateEnd = $('#DateEnd').val();
        let Notes = $('#Notes').val();
        let File = $('#SaleoffImage')[0].files[0];
        // console.log(LicensePlates ,NameCustomers,DateStart,DateEnd);
        if(LicensePlates=='' || DateStart==''||DateEnd==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('LicensePlates',LicensePlates);
        formData.append('TypeOfSaleOff',TypeOfSaleOff);
        formData.append('Denominations',Denominations);
        formData.append('DateStart',DateStart);
        formData.append('DateEnd',DateEnd);
        formData.append('Notes',Notes);
        formData.append('FileImages',File);
        $.ajax({
            url:'/saleoff/create',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                if(!data.error){
                    LoadSaleOff();
                    
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
    // Reload table
    function LoadSaleOff(){
        console.log('Load Sale Off');
        $.ajax({
            url:'/saleoff/getlist',
            method:'post',
            success:function(data){
                if(!data.error){
                    console.log(data);
                    let array = data.data.map((item,index)=>{
                        let text= `<tr>  <td>${index+1}</td> 
                        <td>${item.UserName}</td>
                        <td>${item.LicensePlates}</td>
                        <td>${item.TypeOfSaleOffName}</td>
                        <td>${item.DenominationsNumbers }</td>
                        <td>${ moment(item.DateStart).tz("Asia/Bangkok").format("DD-MM-YYYY ")}</td>
                        <td>${ moment(item.DateEnd).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td>
                        <td>${item.Notes}</td>
                        <td><i class="fa fa-eye show-image"  data-link=${item.Image}></i></td>
                        <td>
                            <div class="btn btn-group-xs">`;
                        if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id=${item.SaleOffID}><i class="fa fa-pencil"></i> Sửa</button>`}
                        if(item.canDelete){ text+= `<button type="button" class="del btn btn-danger deleteSaleOff" data-id=${item.SaleOffID}><i class="fa fa-trash"></i> Xóa</button>`}
                         text+= `
                            </div>
                        </td>`
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
    // Clear Input
    function ClearInput(){
        $('#LicensePlates').val('');

        $('#DateStart').val('');
        $('#DateEnd').val('');
        $('#Notes').val(' ');
        $('#SaleoffImage').val(null);
        $('#image-priview-add').empty();
    }
    // Click OnChange File 
    $('#SaleoffImage').change(function(){
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
    // Delete Sale Off
    $(document).on('click','.deleteSaleOff',function(){
        let SaleOffId= $(this).attr("data-id");
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
                    url:'/saleoff/delete',
                    method:'post',
                    data:{'SaleOffId':SaleOffId},
                    success:function(data){
                        console.log(data);
                        if(!data.error){
                            Swal.fire(
                                'Thành Công!',
                                'Xóa Thành Công !',
                                'success'
                              )
                              LoadSaleOff();
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
        console.log(id);
        $.ajax({
            url : "/saleoff/getInfo",
            method:'post',
            data:{Id:id},
            success:function(data){
                console.log(data);
                if(!data.error){
                    $("#LicensePlatesEdit").val(data.data.LicensePlates);
                    $("#NameCustomerEdit").val(data.data.NameCustomer);
                    $("#TypeOffSaleOffEdit").val(data.data.TypeOfSaleOff).change();
                    $("#DenomintationsEdit").val(data.data.Denominations).change();
                    $("#DateStartEdit").val(moment(data.data.DateStart).tz("Asia/Bangkok").format("YYYY-MM-DD"));
                    $("#DateEndEdit").val(moment(data.data.DateEnd).tz("Asia/Bangkok").format("YYYY-MM-DD"));
                    $("#NotesEdit").val(data.data.Notes);
                    $("#idSaleOffEdit").val(data.data.SaleOffID);
                    $('#image-priview-edit').empty();
                    
                    if(data.data.Image){
                        let img =`<img src="${URLIMAGES+data.data.Image}" class='image-preview'/>`;
                        $('#image-priview-edit').append(img);
                    }
                    $('#editForm').modal('toggle');
                }
               
            }
        })
    })
    // On Change Image Edit 
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
    // Submit SaleOff Edit
    $(document).on('click','#UpdateSaleOff',function(){
        console.log('update sale off');
        let LicensePlates = $("#LicensePlatesEdit").val();
        let TypeOffSaleOff = $("#TypeOffSaleOffEdit").val();
        let Denomintations = $("#DenomintationsEdit").val();
        let DateStart = $("#DateStartEdit").val();
        let DateEnd = $("#DateEndEdit").val();
        let Notes = $("#NotesEdit").val();
        let idSaleOffEdit = $("#idSaleOffEdit").val();
        let File = $('#ImageEdit')[0].files[0];
        if(LicensePlates=='' || DateStart==''||DateEnd==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('LicensePlates',LicensePlates);
        formData.append('TypeOfSaleOff',TypeOffSaleOff);
        formData.append('Denominations',Denomintations);
        formData.append('DateStart',DateStart);
        formData.append('DateEnd',DateEnd);
        formData.append('Notes',Notes);
        formData.append('FileImages',File);
        formData.append('SaleOffID',idSaleOffEdit);
        $.ajax({
            url:'/saleoff/update',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                if(!data.error){
                    LoadSaleOff();
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
        if(!link ||link=='null'){
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
            // linkimageshow.href = `/images/saleoffimages/${link}`;
        }
    })
    // Search form 
    $('.btn-search-form').on('click',function(){
        let LicensePlates = $('#LicensePlatesSearch').val();
        let DateStart = $('#DateStartSearch').val();
        let DateEnd = $('#DateEndSearch').val();
        let TypeOffSaleOff = $('#TypeOffSaleOffSearch').val();
        console.log(LicensePlates,DateStart,DateEnd);
        if(LicensePlates==''&& DateStart=='' && DateEnd==''&& TypeOffSaleOff=='all'){
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
        if(TypeOffSaleOff!='all'){
            data['TypeOffSaleOff']=TypeOffSaleOff;
        }
        $.ajax({
            url:'/saleoff/search',
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
                        <td>${item.LicensePlates}</td>
                        <td>${item.TypeOfSaleOffName}</td>
                        <td>${item.DenominationsNumbers }</td>
                        <td>${ moment(item.DateStart).tz("Asia/Bangkok").format("DD-MM-YYYY ")}</td>
                        <td>${ moment(item.DateEnd).tz("Asia/Bangkok").format("DD-MM-YYYY")}</td>
                        <td>${item.Notes}</td>
                        <td><i class="fa fa-eye show-image"  data-link=${item.Image}></i></td>
                        <td>
                            <div class="btn btn-group-xs">`;
                        if(item.canEdit){ text += `<button type="button" class="edit btn btn-success" data-id=${item.SaleOffID}><i class="fa fa-pencil"></i> Sửa</button>`}
                        if(item.canDelete){ text+= `<button type="button" class="del btn btn-danger deleteSaleOff" data-id=${item.SaleOffID}><i class="fa fa-trash"></i> Xóa</button>`}
                         text+= `
                            </div>
                        </td>`
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
    })
    // Reset Info
    $('.btn-clear-search').on('click',function(){
        $('#LicensePlatesSearch').val('');
        $('#DateStartSearch').val('');
        $('#DateEndSearch').val('');
        $('#TypeOffSaleOffSearch').val('all').change();
        LoadSaleOff();
    })
    // Import Ticket
    $('#importSaleOff').change(function(){
        var reader = new FileReader();
        reader.onload = function(e){
            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            var result = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
           console.log(result);
           $.ajax({
            url : "/saleoff/import",
            method:'post',
            data:{
                data:result
            },
            success: function(data){
                
            }
        })
        }
        reader.readAsBinaryString(event.target.files[0]);
    })
})  