const mongoose = require('mongoose');

const msgTable=new mongoose.Schema({
    sender:{
        type:String,
    },
    name:{
        type:String
    },
    time:{
        type:String
    },
    text:{
        type:String,
    },
    type:{
        type:String,
        default:'text'
    },
    image:{
        type:String
    },
    fileName:{
        type:String,
        default:'null'
    }
})
const chatTeacher=new mongoose.Schema({
    student:{
        type:String,
    },
    msg:[{
        type:msgTable
    }]  
})
const courseTable=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    group:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Group',
        required:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    msg:[{
        type:msgTable
    }],
    chatTeacher:[{
        type:chatTeacher
    }],
})
const Course=mongoose.model('Course',courseTable);
module.exports=Course