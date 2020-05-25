$(document).ready(function(){
    document.querySelectorAll('.dateinput').flatpickr({
        dateFormat: "Y-m-d",
    })
    $('.saveusers').click(function(){
        let Name= $('#Name').val();
        let Dateofbirth = $('#Dateofbirth').val();
        let Phone = $('#Phone').val();
        let Email = $('#Email').val();
        let Introduce = $('#Introduce').val();
        console.log( Name,Dateofbirth,Phone,Email,Introduce);
        $.ajax({
            method:'post',
            url:'/me/update',
            data:{
                Name:Name,
                Phone:Phone,
                Email:Email,
                DateOfBirth:Dateofbirth,
                Introduce:Introduce
            },
            success:function(data){
                if(!data.error){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Cập Nhật Thành Công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    location.reload();
                }
            }
        })
    })
    $('#changeImage').change(function(){
        var formData = new FormData();
        let fileData = $(this).prop("files")[0];
        formData.append('image',fileData);
        console.log(fileData);
        $.ajax({
            url:'/me/updateavatar',
            type:"post",
            cache:false,
            contentType:false,
            processData:false,
            data:formData,
            success:function(data){
                if(!data.error){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Cập Nhật Thành Công',
                        showConfirmButton: false,
                        timer: 1000
                    })
                    location.reload();
                }
            }
        })
    })
})