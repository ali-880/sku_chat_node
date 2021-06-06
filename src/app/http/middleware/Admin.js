const Admin=(req,res,next)=>{
    console.log(req.user.role)
    if(req.user.role==='admin'){
        next()
    }
    else{
        res.status(403).send('not admin')
    }
}
module.exports=Admin