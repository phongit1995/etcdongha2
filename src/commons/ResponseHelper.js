let render = (res,view,data)=>{
    res.render(view,data);
}
let json = (res,error,data)=>{
    if(error){
        res.json({error:error});
    }
    else{
        res.json({error:null,data:data});
    }
}
module.exports = {
    render ,json
}