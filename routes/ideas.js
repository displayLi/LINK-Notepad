const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const router = express.Router()
const navSW = require('../NavIntercept/navIntercept')
const { navIntercept } = navSW

// 引入数据模型 
require('../model/Model')
const Idea = mongoose.model('ideas')

// body-parser
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// 添加
router.get('/add', navIntercept, (req, res) => {
    res.render('ideas/add');
});

// 想学
router.get('/', navIntercept, (req, res) => {
    Idea.find({ userId: req.user._id })
        .sort({ date: 'desc' })
        .then(data => {
            res.render('ideas/ideas', {
                data: data
            });
        })
})

// 编辑
router.get('/edit/:id', navIntercept, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(data => {
            if (data.userId == req.user._id) {
                res.render('ideas/edit', {
                    id: req.params.id,
                    titles: data.titles,
                    details: data.details,
                })
            } else {
                req.flash('err_msg', 'Illegal operation....')
                res.redirect('/ideas')
            }

        })
})

// post方法
router.post('/', urlencodedParser, (req, res) => {
    const err = [];
    if (!req.body.titles) {
        err.push({ text: 'The title cannot be empty~' });
    }

    if (!req.body.details) {
        err.push({ text: 'The detail cannot be empty~' });
    }

    if (err.length > 0) {
        res.render('ideas/add', {
            err: err,
            details: req.body.details,
            titles: req.body.titles
        })
    }
    else {
        const newUsers = {
            details: req.body.details,
            titles: req.body.titles,
            userId: req.user._id
        }
        new Idea(newUsers).save().then(idea => {
            req.flash('success_msg', 'note added successfully...')
            res.redirect('/ideas')
        })
    }
})

// put 方法
router.put('/:id', urlencodedParser, (req, res) => {
    const err = [];
    if (!req.body.titles) {
        err.push({ text: 'The title cannot be empty~' });
    }

    if (!req.body.details) {
        err.push({ text: 'The detail cannot be empty~~' });
    }

    if (err.length > 0) {
        res.render('ideas/edit', {
            err: err,
            details: req.body.details,
            titles: req.body.titles
        })
    }
    else {
        Idea.findOne({
            _id: req.params.id
        })
            .then(data => {
                data.titles = req.body.titles,
                    data.details = req.body.details

                data.save().then(e => {
                    req.flash('success_msg', 'Edit success...')
                    res.redirect('/ideas')
                })
            })
    }
})

// delete 方法

router.delete('/:id', navIntercept, (req, res) => {
    Idea.remove({
        _id: req.params.id
    })
        .then(deletes => {
            req.flash('success_msg', 'Delete success...')
            res.redirect('/ideas')
        })
})

module.exports = router;