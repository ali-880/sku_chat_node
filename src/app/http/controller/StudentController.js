const Course = require("../../model/Course")
const User = require("../../model/User")
const index = async (req, res) => {
    try {
        const courses = await User.findOne({
            studentNumber: req.params.id
        }).populate({
            path: 'courses',
            select: 'name code teacher',
            populate: {
                path: 'teacher',
                select: 'name'
            }
        }).select('courses name role')
        if (!courses) {
            return res.status(404).send('not')
        }
        if (courses.role != 'user') {
            return res.status(400).send('bad')
        }
        res.send(courses)
    } catch (e) {
        return res.status(500).send('server error')
    }
}
const handleSelectLessonForUser = async (req, res) => {
    try {
        const user = await User.findOne({
            studentNumber: req.body.studentNumber
        });
        if (user) {
            const course = await Course.findOne({
                code: req.body.code
            }).populate('teacher','name').select('name code teacher chatTeacher');
            if (course) {
                await user.updateOne({
                    $push: {
                        courses: course
                    }
                });
                await course.updateOne({
                    $push: {
                        users: user
                    }
                });
                console.log(course.chatTeacher)
                course.chatTeacher.push({
                    student:user._id,
                    msg:[]
                })
                await course.save();
                res.send(course)
            } else {
                console.log(e)
                return res.status(404).send('not foundsdsd')
            }
        } else {
            console.log(e)
            return res.status(404).send('not found')
        }
    } catch (e) {
        console.log(e)
        return res.status(500).send('error server')
    }

}
const destroyLesson=async(req,res)=>{
    try {
        const user = await User.findOne({
            studentNumber: req.params.user
        });
        if (user) {
            const course = await Course.findOne({
                code: req.params.course
            });
            if (course) {
                await user.updateOne({
                    $pull: {
                        courses: course._id
                    }
                });
                await course.updateOne({
                    $pull: {
                        users: user._id
                    }
                });
                res.send(course)
            } else {
                return res.status(404).send('not foundsdsd')
            }
        } else {
            return res.status(404).send('not found')
        }
    } catch (e) {
        res.status(500).send('bad')
    }
}
const show=async(req,res)=>{
    const user= await User.findOne({_id:req.user._id}).select('courses').populate({path:'courses',select:'name teacher',populate:{path:'teacher',select:'name'}})
    if(user){
        res.send(user.courses)
    }else{
        res.status(404).send('error')
    }
}
module.exports.show=show
module.exports.destroyLesson=destroyLesson
module.exports.handleSelectLessonForUser=handleSelectLessonForUser
module.exports.index = index