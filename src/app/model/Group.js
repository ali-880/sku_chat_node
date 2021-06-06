const mongoose=require('mongoose');
const groupTable=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
})
const Group=mongoose.model('Group',groupTable);
module.exports=Group