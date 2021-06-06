const mongoose = require("mongoose");

const userTable=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    studentNumber:{
        type:String,
        required:true,
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    enteringYear:{
        type:String,
        required:true
    },
    role:{
        type:String
    },
    image:{
        type:String
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    online:{
        type:Boolean,
        default:false
    }
})
const User=mongoose.model('User',userTable);
module.exports=User;