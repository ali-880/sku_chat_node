const Course = require("../../model/Course");
const User = require("../../model/User")

const Dashbor=async(req,res)=>{
    try {
        const user=await User.find({role:'user'}).count();
        const teacher=await User.find({role:'teacher'}).count();
        const admin=await User.find({role:'admin'}).select('name group').populate({path:'group',select:'name'});
        const course=await Course.count();
        const result={
            user,
            teacher,
            admin,
            course,
        }
        res.send(result)
    } catch (e) {
        res.status(500).send('bad error')
    }
}

module.exports.Dashbor=Dashbor