const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

require('../model/Users')
const Users = mongoose.model('Users')

// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 配置路由
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

// 退出登录
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Logged out successfully!')
    res.redirect('login')
});

// 注册
router.post('/register', urlencodedParser, (req, res) => {
    const err = [];
    if (req.body.userName !== '' && req.body.email !== '' && req.body.password1 !== '' && req.body.password2 !== '') {
        if (req.body.password1.length > 4 && req.body.password1.length <= 16) {
            if (req.body.password1 == req.body.password2) {
                Users.findOne({
                    email: req.body.email
                })
                    .then(result => {
                        if (result == null) {
                            let users = new Users({
                                userName: req.body.userName,
                                email: req.body.email,
                                password: req.body.password1,
                            })

                            // 密码加密
                            bcrypt.genSalt(10, (err, salt) => {
                                bcrypt.hash(users.password, salt, (err, hash) => {
                                    users.password = hash;
                                    users.save()
                                        .then(e => {
                                            req.flash('success_msg', "注册成功，请登录~")
                                            res.redirect('/users/login')
                                        })
                                });
                            });
                        } else {
                            err.push({ text: '该邮箱已被注册，请重现填写...' })
                            res.render('users/register', {
                                err: err,
                                userName: req.body.userName,
                                email: req.body.email,
                                password1: req.body.password1,
                                password2: req.body.password2
                            })
                        }
                    })
            } else {
                err.push({ text: '两次密码不一致' })
            }
        } else {
            err.push({ text: '密码长度在4~16位之间' })
        }
    } else {
        err.push({ text: '所有都是必填项' })
    }

    if (err.length > 0) {
        res.render('users/register', {
            err: err,
            userName: req.body.userName,
            email: req.body.email,
            password1: req.body.password1,
            password2: req.body.password2
        })
    }
})


// 登录

router.post('/login', urlencodedParser, (req, res, next) => {
    if (req.body.email !== '' && req.body.password !== '') {
        passport.authenticate('local',
            {
                successRedirect: '/ideas',
                failureRedirect: '/users/login',
                failureFlash: true
            },
        )(req, res, next);
    } else {
        req.flash('err_msg', "You enter a mailbox and password that cannot be empty...");
        res.redirect('/users/login');
        return;
    }
})

module.exports = router;