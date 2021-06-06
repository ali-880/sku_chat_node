const express = require('express');
const UserController = require('../app/http/controller/UserController');
const CourseController = require('../app/http/controller/CourseController')
const GroupController = require('../app/http/controller/GroupController');
const StudentController = require('../app/http/controller/StudentController');
const ChatPageController = require('../app/http/controller/ChatPageController');
const DashbordController = require('../app/http/controller/DashbordController');

const Router = express.Router();
const path = require('path')
const multer = require('multer');
const Auth = require('../app/http/middleware/Auth');
const Admin = require('../app/http/middleware/Admin');
const fs = require('fs')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/user/')
  },
  filename: function (req, file, cb) {
    cb(null, 'userImg _' + Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var upload = multer({
  storage: storage
});
////////////////////////////////////
var storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync(`src/public/file/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}`)) {
      req.dataFile=`${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}`;
      req.dataName=file.originalname
      cb(null, `src/public/file/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}/`)
    } else {
      fs.mkdirSync(`src/public/file/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}`, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('File is created successfully.');
        }
      });
      req.dataFile=`${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}`;
      req.dataName=file.originalname
      cb(null, `src/public/file/${new Date().getFullYear()}_${new Date().getMonth()}_${new Date().getDay()}/`)
    }
  },
  filename: function (req, file, cb) {
    cb(null, 'fileImg _' + Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var uploadFile = multer({
  storage: storageFile
});

//register  login
//3-superadmin want get user(teacher or student)from server in select group
//4-delete user
//5-verify token
Router.post('/api/register', [Auth, Admin, upload.single('image')], UserController.register);
Router.post('/api/login', UserController.login)
Router.post('/api/admin/user/show', [Auth, Admin], UserController.getUserForGroup);
Router.delete('/api/user/:id', [Auth, Admin], UserController.destroy)
Router.get('/api/verifyToken', [Auth], UserController.verify);

//create course
//2-admin want get course with select group
//3-delete course
Router.post('/api/course', [Auth, Admin], CourseController.create)
Router.get('/api/admin/course/show/:group', [Auth, Admin], CourseController.adminGetCourses);
Router.delete('/api/course/:id', [Auth, Admin], CourseController.destroy);

//group 1-get all group
//2-create group
Router.get('/api/group', [Auth, Admin], GroupController.index)
Router.post('/api/group', [Auth, Admin], GroupController.create)

//student 1-get lesson student have in the term
//2-add lessons to user
//3-delete course un list of the user
//4- in home shoe lesson student
Router.get('/api/student/lessons/:id', [Auth, Admin], StudentController.index);
Router.post('/api/student/lessons', [Auth, Admin], StudentController.handleSelectLessonForUser);
Router.delete('/api/student/course/:user/:course', [Auth, Admin], StudentController.destroyLesson);
Router.get('/api/user/student/lessons', [Auth], StudentController.show)


//1- get lessons msg users for chatpage
Router.get('/api/lessens/chatpage/:id',[Auth], ChatPageController.handleGetLessonForChatPage);
  
//1-file message get file
Router.post('/api/user/file',[Auth,uploadFile.single('file')],CourseController.handleFileMessage )

//1-get info dashbord
Router.get('/api/getSystemInfo',[Auth,Admin],DashbordController.Dashbor);

Router.get('/api/chatWithTeacher/:id',[Auth],ChatPageController.chatWithTeacher)
Router.get('/api/chatWithStudent/:course_id/:user_id',ChatPageController.chatWithStudent)
Router.post('/api/forgetPassword',UserController.forgetPassword)

module.exports = Router
