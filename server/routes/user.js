const express = require('express');
const router = express.Router();
const logger = require('../logger').logger;
const User = require('../db/user');
const setDataLog = require('./setDataLog');
//登录接口
router.post('/login', function(req, res) {
    let account = req.body.account;
    let passwd = req.body.passwd;
    if (!account) {
        res.json({
            status: 400,
            msg: '帐号不能为空'
        })
    } else if (!passwd) {
        res.json({
            status: 400,
            msg: '密码不能为空'
        })
    }
    User.findOne({ account: account, passwd: passwd }, (error, doc)=>{
        if (error) {
            logger.error(`user::/login::error:${JSON.stringify(error)}`);
            res.json({
                status: 400,
                msg: '用户名或密码错误'
            });
        } else if (doc && !doc.active) {
            res.json({
                status: 400,
                msg: '帐号已过期'
            });
        } else if (doc) { 
            res.json({
                status: 200,
                result: doc,
                msg: 'OK'
            })
            User.updateOne({ account: account }, { lastLogin: new Date().getTime() }, (err, doc) => {
                if (err) {
                    logger.error(`user::/login::updateOne::err:${JSON.stringify(err)}`);
                }
            })
        }else{
            res.json({
                status: 400,
                msg: '密码错误'
            });
        } 
    })
});

//帐号创建接口
router.post('/create', function(req, res) {
    let data = req.body;
    if (!data.account) {
        res.json({
            status: 400,
            msg: '帐号不能为空'
        })
    }
    if (!data.passwd) {
        res.json({
            status: 400,
            msg: '密码不能为空'
        })
    }
    User.findOne({ account: data.account }, (error, doc)=>{
        if (error) {
            logger.error(`user::/create::error:${JSON.stringify(error)}`);
            res.json({
                status: 500
            });
        } else if(doc){
            res.json({
                status: 400,
                msg: '用户已存在'
            });
        } else {
            User.create({
                account: data.account,
                passwd: data.passwd,
                username: data.username,
                active: true,
                created: new Date().getTime(),
                updated: new Date().getTime(),
                lastLogin: null,
                admin: data.admin||false
            }, (err, result) => {
                if (err) {
                    logger.error(`user::/create::err:${JSON.stringify(err)}`);
                    res.json({
                        status: 500
                    });
                } else {
                    logger.info(`user::/create::params:${JSON.stringify(data)}`);
                    res.json({
                        status: 200,
                        msg: '创建成功'
                    })
                }
            })
        }
    })
});

//修改密码
router.post('/update', function(req, res) {
    let data = req.body;
    if (!data.account) {
        res.json({
            status: 400,
            msg: '帐号不能为空'
        })
    }
    if (!data.passwd) {
        res.json({
            status: 400,
            msg: '密码不能为空'
        })
    }
    User.updateOne({account: data.account},{
        passwd: data.passwd
    }, (err, result) => {
        if (err) {
            logger.error(`user::/update::err:${JSON.stringify(err)}`);
            res.json({
                status: 500,
                msg: '未知错误'
            });
        } else {
            logger.info(`user::/update::params:${JSON.stringify(data)}`);
            res.json({
                status: 200,
                msg: '更新成功'
            })
        }
    })
});

//帐号删除
router.post('/delete', function(req, res) {
    let data = req.body;
    if (!data.id) {
        res.json({
            status: 400,
            msg: '不存在该用户'
        })
    }
    User.deleteOne({ _id: data.id }, (error, doc) => {
        if (error) {
            logger.error(`user::/delete::error:${JSON.stringify(error)}`);
            res.json({
                status: 500,
                msg: '未知错误'
            });
        } else {
            res.json({
                status: 200,
                msg: '已删除'
            });
        }
    })
});

//管理员列表
router.get('/list', function (req, res) {
    let query = req.query;
    User.countDocuments({}, (error, count) => {
        if (error) {
            logger.error(`user::/list::error:${JSON.stringify(error)}`);
            res.json({
                status: 400,
                msg: JSON.stringify(error)
            });
        } else {
            User.find({}, 'account admin created lastLogin username').skip((query.pageNo - 1) * query.pageSize).limit(parseInt(query.pageSize)||20) .sort({ 'created': -1 }).exec((err, doc) => {
                if (err) {
                    logger.error(`user::/list::err:${JSON.stringify(err)}`);
                    res.json({
                        status: 400,
                        msg: JSON.stringify(err)
                    });
                } else {
                    res.json({
                        status: 200,
                        result: doc,
                        total: count,
                        msg:'OK'
                    });
                }
            })
        }
    })
});
//管理员详情
router.get('/detail', function (req, res) {
    let query = req.query;
    User.findOne({
        _id: query._id
    }).exec((err, doc) => {
        if (err) {
            logger.error(`user::/detail::err:${JSON.stringify(err)}`);
            res.json({
                status: 400,
                msg: JSON.stringify(err)
            });
        } else {
            res.json({
                status: 200,
                result: doc,
                msg:'OK'
            });
        }
    })
});

module.exports = router;