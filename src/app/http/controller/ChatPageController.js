const Course = require("../../model/Course")

const handleGetLessonForChatPage=async(req,res)=>{
    try{
        const course=await Course.findOne({_id:req.params.id}).select('name msg users teacher group')
        .populate({path:'users',select:'name lastName group image online role',populate:{path:'group'}})
        .populate({path:'teacher',select:'name group',populate:{path:'group'}})
        .populate('group')
        if(course){
            return res.send(course)
        }else{
            return res.status(404).send('error')
        }
    }catch(e){
        return res.status(500).send('bad error');
    }
}
const chatWithTeacher=async(req,res)=>{
    try{
        const course=await Course.findOne({_id:req.params.id}).select('chatTeacher');
        const num=course.chatTeacher.findIndex(item=>item.student.toString()===req.user._id.toString())
        res.send(course.chatTeacher[num].msg)
    }catch(e){
        return res.status(500).send('bad error');
    }
}
const chatWithStudent=async(req,res)=>{
    try{
        const course=await Course.findOne({_id:req.params.course_id}).select('chatTeacher');
        const num=course.chatTeacher.findIndex(item=>item.student.toString()===req.params.user_id.toString())
        res.send(course.chatTeacher[num].msg)
    }catch(e){
        console.log(e)
        return res.status(500).send('bad error');
    }
}
module.exports.chatWithStudent=chatWithStudent;
module.exports.chatWithTeacher=chatWithTeacher;
module.exports.handleGetLessonForChatPage=handleGetLessonForChatPage;