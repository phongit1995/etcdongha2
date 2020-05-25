$(document).ready(function(){
  document.querySelectorAll('.dateinput').flatpickr({
    dateFormat: "Y-m-d ",
})
    $(".change-password").on('click', async function(){
        let IdUsers= $(this).data('id');
        const  {value} = await Swal.fire({
            title: 'Đổi Mật Khẩu Nhân Viên',
            input: 'password',
            inputPlaceholder: 'Nhập Mật Khẩu',
            showCancelButton: true,
            inputAttributes: {
              maxlength: 10,
              autocapitalize: 'off',
              autocorrect: 'off'
            }
          })
          if (value) {
            $.ajax({
                url:'/users/changepassword',
                method:'post',
                data:{
                    Id:IdUsers,
                    newpassword:value
                },
                success:function(data){
                    console.log(data);
                    if(!data.error){
                        Swal.fire(
                            'Thông Báo!',
                            'Đổi Mật Khẩu Thành Công!',
                            'success'
                          )
                    }
                }
            })
          }
    })
    // create User
    $('#createUser').click(function () {
        let name = $('#Name').val();
        let group = $('#group').val();
        let role = $('#Role').val();
        let username = $('#username').val();
        let password = $('#password').val();
        let dateofbirth = $('#dateofbirth').val();
        let phone = $('#phone').val();
        if(name=='' || username=='' || password==''){
          return alertify.error('Vui Lòng Nhập Đủ Thông Tin');
        }
        let data = {};
        data['Name']=name ;
        data['Group']= group ;
        data['Role']= role ;
        data['UserName']= username ;
        data['Password']=password ;
        data['DateOfBirth']= dateofbirth ;
        data['Phone']=phone ;
        console.log(data);
        $.ajax({
          url:'/users/create',
          method:'post',
          data:data,
          success:function(data){
            if(data.error){
              Swal.fire(
                'Lỗi!',
                data.error,
                'error'
              )
            }
            else{
              Swal.fire(
                'Thành Công!',
                'Tạo Thành Công',
                'success'
              )
              location.reload();
            }

          }
        })
    })
    $(".delete-user").on('click',function(){
        let IdUsers= $(this).data('id');
        Swal.fire({
          title: 'Xóa Thông Tin?',
          text: "Bạn Có Muốn Xóa User Này Không!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đồng Ý!'
        }).then((result) => {
          if(result.value){
            $.ajax({
              url:'/users/delete',
              method:'post',
              data:{ID:IdUsers},
              success:function(data){
                  if(!data.error){
                    Swal.fire(
                      'Thành Công!',
                      'Tạo Thành Công',
                      'success'
                    )
                    location.reload();
                  }
              }
            })
          }
        })
    })
})