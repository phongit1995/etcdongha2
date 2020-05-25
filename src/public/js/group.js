$(document).ready(function(){
    $('#addgroups').on('click',async function(){
        const { value } = await Swal.fire({
            title: 'Nhập Tên Group Cần Thêm',
            input: 'text',
            inputPlaceholder: 'Nhập Tên'
          })
          
          if (value) {
                $.ajax({
                    url:'/groups/create',
                    method:'post',
                    data:{GroupName:value},
                    success: function(data){
                        if(!data.error){
                            location.reload();
                        }
                    }
                })
          }
    })
})
