const jwt = require('jsonwebtoken');
const User = require('../../model/User');
const Auth=async(req,res,next)=>{
    const token=req.header('Authorization');
    if(token){
        try{
            const user=jwt.verify(token,'mohandesi narm afzar')
            // if(await User.findOne({_id:user._id})){
                req.user=user;
                next();
            // }else{
            //     res.status(405).send('token delete')
            // }
            
        }catch(e){
            console.log(e)
            return res.status(400).send({success:false})
        }
    }else{
        res.status(401).send({success:false})
    }
}
module.exports=Auth
