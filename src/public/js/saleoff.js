let statusEdit = false ;
$(document).ready(function(){
    const URLIMAGES = '/images/storage/';
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
        let TrackingNo = $('#TrackingNo').val();
        let StatusPro = $('#StatusPro').val();
        let AddVn = $('#AddVn').val();
        let PhoneVn = $('#PhoneVn').val();
        let AddJp = $('#AddJp').val();
        let PhoneJp = $('#PhoneJp').val();
        let Notting = $('#Notting').val();
        let NameProduct = $('#NameProduct').val();
        let ForUser = $("#ForUser").val();
        let QtyPro = $('#QtyPro').val();
        let RatePro = $('#RatePro').val();
        let TickMoney = $('#TickMoney').val();
        let DateDeli = $('#DateDeli').val();
        let File = $('#SaleoffImage')[0].files[0];
        console.log(TrackingNo ,StatusPro,AddVn,PhoneVn,AddJp,PhoneJp,Notting,NameProduct,QtyPro,RatePro,TickMoney,DateDeli);
        if(TrackingNo=='' || AddVn==''||PhoneVn==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('TrackingNo',TrackingNo);
        formData.append('StatusPro',StatusPro);
        formData.append('AddVn',AddVn);
        formData.append('PhoneVn',PhoneVn);
        formData.append('AddJp',AddJp);
        formData.append('PhoneJp',PhoneJp);
        formData.append('ForUser',ForUser);
        formData.append('Notting',Notting);
        formData.append('NameProduct',NameProduct);
        formData.append('QtyPro',QtyPro);
        formData.append('RatePro',RatePro);
        formData.append('TickMoney',TickMoney);
        formData.append('DateDeli',DateDeli);
        formData.append("FileImages",File)
        $.ajax({
            url:'/saleoff/create',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                if(!data.error){
                    // LoadSaleOff();
                    
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Thêm Thành Công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                   setTimeout(()=>{
                        location.reload();
                   },500)
                   
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
                              setTimeout(()=>{
                                location.reload();
                                },500)
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
                    console.log(statusEdit);
                    statusEdit=true ;
                    $("#TrackingNoEdit").val(data.data[0].TrackingNo);
                    $("#StatusProEdit").val(data.data[0].StatusPro).change();
                    $("#ForUserEdit").val(data.data[0].ForUser).change();
                    $("#AddVnEdit").val(data.data[0].AddVn)
                    $("#PhoneVnEdit").val(data.data[0].PhoneVn)
                    $("#AddJpEdit").val(data.data[0].AddJp)
                    $("#PhoneJpEdit").val(data.data[0].PhoneJp)
                    $("#NottingEdit").val(data.data[0].Notting)
                    $("#NameProductEdit").val(data.data[0].NameProduct)
                    $("#QtyProEdit").val(data.data[0].QtyPro);
                    $("#RateProEdit").val(data.data[0].RatePro);
                    $("#TickMoneyEdit").val(data.data[0].TickMoney);
                    $("#DateDeliEdit").val( moment(data.data[0].DateDeli).tz("Asia/Bangkok").format("YYYY-MM-DD"));
                    $("#idSaleOffEdit").val(data.data[0].SaleOffID);
                    $('#image-priview-edit').empty();
                    
                    if(data.data[0].SaleoffImage){
                        let img =`<img src="${URLIMAGES +data.data[0].SaleoffImage}" class='image-preview'/>`;
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
        let SaleOffId= $("#idSaleOffEdit").val();
        let TrackingNo = $('#TrackingNoEdit').val();
        let StatusPro = $('#StatusProEdit').val();
        let AddVn = $('#AddVnEdit').val();
        let PhoneVn = $('#PhoneVnEdit').val();
        let AddJp = $('#AddJpEdit').val();
        let PhoneJp = $('#PhoneJpEdit').val();
        let Notting = $('#NottingEdit').val();
        let NameProduct = $('#NameProductEdit').val();
        let ForUser = $("#ForUserEdit").val();
        let QtyPro = $('#QtyProEdit').val();
        let RatePro = $('#RateProEdit').val();
        let TickMoney = $('#TickMoneyEdit').val();
        let DateDeli = $('#DateDeliEdit').val();
        let File = $('#SaleoffImageEdit')[0].files[0];
        console.log(TrackingNo ,StatusPro,AddVn,PhoneVn,AddJp,PhoneJp,Notting,NameProduct,QtyPro,RatePro,TickMoney,DateDeli,SaleOffId);
        if(TrackingNo=='' || AddVn==''||PhoneVn==''){
            return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let formData = new FormData();
        formData.append('SaleOffID',SaleOffId);
        formData.append('TrackingNo',TrackingNo);
        formData.append('StatusPro',StatusPro);
        formData.append('AddVn',AddVn);
        formData.append('PhoneVn',PhoneVn);
        formData.append('AddJp',AddJp);
        formData.append('PhoneJp',PhoneJp);
        formData.append('ForUser',ForUser);
        formData.append('Notting',Notting);
        formData.append('NameProduct',NameProduct);
        formData.append('QtyPro',QtyPro);
        formData.append('RatePro',RatePro);
        formData.append('TickMoney',TickMoney);
        formData.append('DateDeli',DateDeli);
        formData.append("FileImages",File)
        console.log(formData);
        $.ajax({
            url:'/saleoff/update',
            method:'post',
            data:formData,
            cache : false,
            contentType: false,
            processData: false,
            success:function(data){
                if(!data.error){
                    // LoadSaleOff();
                  
                    Swal.fire(
                        'Thành Công!',
                        'Cập Nhật Thông Tin Thành Công!',
                        'success'
                      )
                      setTimeout(()=>{
                        location.reload();
                        },500)
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