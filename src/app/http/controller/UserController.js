const User = require("../../model/User")
const userValidation = require('../validator/UserValidation')
const bcrypt = require('bcrypt')
//register user
const fs = require('fs')
const jwt = require('jsonwebtoken')

const nodemailer = require("nodemailer");
async function main(data) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "mail.testfornodealireza.ir",
        port:465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'alirezahoseynigh@testfornodealireza.ir', // generated ethereal user
            pass: '11401140ali', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'alirezahoseynigh@testfornodealireza.ir', // sender address
        to: data.email, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: `<b>${data.text}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

const register = async (req, res) => {
    try {
        if (userValidation.userRegisterValidation(req.body)) {
            fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            return res.status(400).send(userValidation.userRegisterValidation(req.body))
        }
        const is_user = await User.findOne({
            studentNumber: req.body.studentNumber
        })
        if (is_user) {
            fs.unlink(`src/public/user/${req.file.filename}`, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
            return res.status(409).send('دانشجویی با این شماره دانشجویی قبلا در سامانه ثبت شده است')
        }
        const salt = 10;
        const password = await bcrypt.hash(req.body.password, salt);
        const user = new User({
            name: req.body.name,
            lastName: req.body.lastName,
            password: password,
            studentNumber: req.body.studentNumber,
            group: req.body.group,
            enteringYear: req.body.enteringYear,
            role: req.body.role,
            image: req.file.filename
        })
        await user.save();
        res.send(user)
    } catch (e) {
        return res.status(500).send('اشتباه از سمت سرور')
    }
}
const login = async (req, res) => {
    try {
        const user = await User.findOne({
            studentNumber: req.body.studentNumber
        })
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                const data = {
                    _id: user._id,
                    name: user.name,
                    studentNumber: user.studentNumber,
                    lastName: user.lastName,
                    group: user.group,
                    enteringYear: user.enteringYear,
                    role: user.role,
                    image: user.image,
                    exp: new Date().getTime() + 172800000,
                    online: false
                }
                const token = jwt.sign(data, 'mohandesi narm afzar')
                res.send({
                    status: true,
                    token: token,
                    user: data
                });
            } else {
                return res.status(404).send('not')
            }
        } else {
            return res.status(404).send('not found')
        }
    } catch (e) {
        console.log(e)
        res.status(500).send('bad')
    }
}
const getUserForGroup = async (req, res) => {
    try {
        const users = await User.find({
            $and: [{
                role: req.body.role
            }, {
                group: req.body.group
            }, {
                enteringYear: req.body.enteringYear
            }]
        }).select('name lastName image studentNumber');
        res.send(users);
    } catch (e) {
        res.status(500).send('bad error');
    }
}
const destroy = async (req, res) => {
    try {
        await User.findByIdAndRemove({
            _id: req.params.id
        });
        res.send('ok')
    } catch (e) {
        res.status(500).send('bad error');
    }
}
const verify = (req, res) => {
    res.send({
        success: true
    })
}

const forgetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            studentNumber: req.body.studentNumber
        });
        if (!user) {
            return res.status(500).send('not found user');
        }
        const number = Math.floor(Math.random() * 100000000);
        const salt = 10;
        const password = await bcrypt.hash(number.toString(), salt);
        await user.updateOne({
            password: password
        });
        await user.save();
        data = {
            email: req.body.email,
            subject: 'بازیابی رمز عبور',
            text: `رمز عبور جدید شما برابر است با : ${number}`
        }
        console.log('dddddddddddddddd')
        await main(data)
        res.send('ok')
    }catch(e){
        console.log(e)
        res.status(500).send('error')
    }
}
module.exports.forgetPassword=forgetPassword;
module.exports.verify = verify
module.exports.destroy = destroy
module.exports.login = login
module.exports.getUserForGroup = getUserForGroup;
module.exports.register = register