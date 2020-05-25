let checkIsLogin = (req,res,next)=>{
    
    if(req.isAuthenticated()){
         return next();
    }
    return res.redirect("/login");
}
let checkIsAdmin = (req,res,next)=>{
    if(req.user.Role<3){
        return next();
    }
    return res.redirect("/");
}
let CheckIsSuperAdmin = (req,res,next)=>{
    if(req.user.Role==1){
        return next();
    }
    return res.redirect("/");
}

module.exports = {
    checkIsLogin,checkIsAdmin,CheckIsSuperAdmin
}