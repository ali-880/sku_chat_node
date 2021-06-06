const mongoose = require('mongoose');
const Course = require('../../model/Course');
const User = require('../../model/User');
const create=async(req,res)=>{
    try{
        const isTeacher=await User.findOne({studentNumber:req.body.teacher})
        if(!isTeacher){
            return res.status(404).send('استادی با این کد در سامانه پیدا نشود')
        }
        if(isTeacher.role!=='teacher'){
            return res.status(400).send('کد وارد شده در سامانه نقش استاد را ندارد ')
        }
        const IsCourse=await Course.findOne({code:req.body.code});
        if(IsCourse){
            return res.status(409).send('error')
        }
        const course=new Course({
            name:req.body.name,
            group:req.body.group,
            code:req.body.code,
            teacher:isTeacher._id
        })
        await course.save();
        await isTeacher.updateOne({
            $push:{
                courses:course
            }
        })
        await course.updateOne({
            $push:{
                users:isTeacher
            }
        })
        return res.send(course)
    }catch(e){
        console.log(e)
        return res.status(500).send('server error')
    }
}
const adminGetCourses=async(req,res)=>{
    try {
        const courses=await Course.find({group:req.params.group}).populate('teacher','name').select('name teacher code');
        res.send(courses)
    } catch (e) {
        return res.status(500).send('server error')
    }
}
const destroy=async(req,res)=>{
    try {
        await Course.findByIdAndRemove({_id:req.params.id})
        res.send('ok')
    } catch (e) {
        return res.status(500).send('server error')
    }
}
const handleFileMessage=(req,res)=>{
    try{
        console.log(`${req.dataFile}/${req.file.filename}`)
        const result={
            text:`${req.dataFile}/${req.file.filename}`,
            fileName:req.dataName,
        }
        res.send(result);
    }catch(e){
        res.status(500).send('error')
    }
}
module.exports.adminGetCourses=adminGetCourses
module.exports.create=create
module.exports.destroy=destroy
module.exports.handleFileMessage=handleFileMessage