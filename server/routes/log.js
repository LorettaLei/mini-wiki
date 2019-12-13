const express = require('express');
const router = express.Router();
const logger = require('../logger').logger;
const Log = require('../db/dataLog');
//菜单列表
router.get('/list', function (req, res) {
    let query = req.query;
    Log.countDocuments({
        user: { $regex: query.user }
    }, (error, count) => {
        if (error) {
            logger.error(`log::/list::error:${JSON.stringify(error)}`);
            res.json({
                status: 400,
                msg: JSON.stringify(error)
            });
        } else {
            Log.find({
                user: { $regex: query.user },
            }).populate({ path: '_user',select: 'username account'}).skip((query.pageNo - 1) * query.pageSize).limit(parseInt(query.pageSize) || 20).sort({ 'created': -1 }).exec((err, result) => {
                if (err) {
                    logger.error(`log::/list::err:${JSON.stringify(err)}`);
                    res.json({
                        status: 400,
                        msg: '未知错误'
                    });
                } else {
                    res.json({
                        status: 200,
                        result: result,
                        total: count,
                        msg: 'OK'
                    })
                }
            })
        }
    })
});
module.exports = router;
