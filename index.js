const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Router = require('./src/router/api');
const Course = require('./src/app/model/Course');

const app=express();
app.use(cors())
app.options('*', cors());
app.use(express.json())
app.use(express.static('src/public'))
app.use(Router)

const server=app.listen(4000,(error)=>{
    if(error){
        console.log('we have error to connect in port 4000');
    }else{
        console.log('we connect to port 40000')
    }
})
const io=require('socket.io')(server);
const fs=require('fs');
const User = require('./src/app/model/User');
const Connect=async()=>{
    await mongoose.connect('mongodb://localhost:27017/sku_chat',{useNewUrlParser:true,useUnifiedTopology:true},(e)=>{
        if(e){
            console.log(e)
        }else{
            console.log('connect to mongo db')
        }
    })
}
Connect();

const mySocket=io.of('/socket')
mySocket.on('connection',(socket)=>{
    console.log('connect to page')
    socket.on('joinToChat',async(data)=>{
        const user=await User.findOneAndUpdate({_id:data.student},{$set:{
            online:true
        }},{new:true});
        socket.join(`${data.id}`)
        mySocket.to(`${data.id}`).emit('setOnline',user._id);
    })
    socket.on('handleTextMessage',async(data)=>{
        const course=await Course.findOne({_id:data.id});
        const msgd=course.msg.push(data.message);
        course.save().then(()=>{
            mySocket.to(`${data.id}`).emit('handleTextMessage',course.msg[msgd-1])
        }).catch((e)=>{
            console.log(e)
        })
    })
    socket.on('offline',async(data)=>{
        const user=await User.findOneAndUpdate({_id:data.user},{$set:{
            online:false
        }},{new:true});
        mySocket.to(`${data.id}`).emit('setOfline',user._id);
        socket.leave(`${data.id}`)
    })
    socket.on('handleDelete',async(data)=>{
        const course=await Course.findOne({_id:data.lesson});
        const msg=course.msg.id(data.msg_id)
        console.log(msg)
        if(msg.type==='file'){
            fs.unlink(`src/public/file/${msg.text}`,(e)=>{
                if(e){
                    console.log(e)
                }
            })
        }
        msg.remove();
        course.save();
        mySocket.to(`${data.lesson}`).emit('handleDelete',data.msg_id)
    })
    socket.on('handleSendFile',async(data)=>{
        const course=await Course.findOne({_id:data.lesson});
        const msgd=course.msg.push(data.message);
        course.save().then(()=>{
            mySocket.to(`${data.lesson}`).emit('handleTextMessage',course.msg[msgd-1])
        }).catch((e)=>{
            console.log(e)
        })  
    })




    socket.on('joinChatWithTeacher',(data)=>{
        socket.join(`${data.user} ${data.lesson}`)
    })

    socket.on('handleSendMessageForTeacher',async(data)=>{
        const course=await Course.findOne({_id:data.lesson}).select('chatTeacher')
        const index=course.chatTeacher.findIndex((item)=>item.student.toString()===data.student.toString())
        const d=course.chatTeacher[index].msg.push(data.message);
        await course.save();
        mySocket.to(`${data.student} ${data.lesson}`).emit('handleSendMessageForTeacher',course.chatTeacher[index].msg[d-1])
    })

    socket.on('handleDeleteTeacherChat',async(data)=>{
        const course=await Course.findOne({_id:data.lesson}).select('chatTeacher')
        console.log(data.msg_id)
        const index=course.chatTeacher.findIndex((item)=>item.student.toString()===data.user.toString())
        console.log(course.chatTeacher[index].msg.id(data.msg_id))
        course.chatTeacher[index].msg.id(data.msg_id).remove()
        await course.save()
        mySocket.to(`${data.user} ${data.lesson}`).emit('handleDeleteTeacherChat',data.msg_id);
    })

    socket.on('disconnect',()=>{
        console.log('disconnect from page')
    })
})
