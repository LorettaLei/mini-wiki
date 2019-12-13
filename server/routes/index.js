const express = require('express');
const router = express.Router();
const logger = require('../logger').logger;
const fs = require('fs');
const Config = require('../../docs/docs/.vuepress/config')
const setDataLog = require('./setDataLog');
var exec = require('child_process').exec;
//创建文档
router.post('/create', function(req, res) {
    let data = req.body;
    if (!data.title || !data.content || !data.user) {
        res.json({
            status: 400,
            msg: '数据校验失败'
        })
    }
    setDataLog.setLog(data.user, `创建文档: ${ data.title }`);
    let filename = randomNum(10);
    fs.writeFile(`./docs/docs/html/${filename}.md`, data.content, function (err) {
        if (err) {
            logger.error(`index:::/create:::err:${JSON.stringify(err)}`)
            res.json({
                status: 400,
                msg: '创建失败'
            })
        }
        logger.info(`index:::/create:::filename:${filename}.md`);
        let sidebar = Config.themeConfig.sidebar;
        if (data.parent) {
            let obj = {children:sidebar,item:{}};
            path = JSON.parse(data.parent);
            object = { title: data.title, path: `/html/${filename}` };
            json = setSideBar(obj, path, path.length - 1, object);
            console.log(json)
        } else {
            sidebar.push({
                title: data.title,
                path: `/html/${filename}`
            })
        }
        let config = Config;
        config.themeConfig.sidebar = sidebar;
        fs.writeFile(`./docs/docs/.vuepress/config.js`, `module.exports = ${JSON.stringify(config)}`, function (error) {
            if (error) {
                logger.error(`index:::/create:::error:${JSON.stringify(error)}`)
                res.json({
                    status: 400,
                    msg: '导航更新失败'
                })
            }
            reBuildDocs('/create');
            res.json({
                status: 200
            })
        })
    })
});
//修改文档
router.post('/update', function(req, res) {
    let data = req.body;
    if (!data.path || !data.content || !data.user) {
        res.json({
            status: 400,
            msg: '数据校验失败'
        })
    }
    let sidebar = Config.themeConfig.sidebar;
    let path = JSON.parse(data.path).map(ele => {
        return {
            title: ele,
            item: {}
        }
    });
    setDataLog.setLog(data.user, `更新文档: ${path[0].title}`);
    let obj = { children: sidebar, item: {}};
    for (let i = path.length - 1; i >= 0; i--) {
        obj = findItem(obj.children, path[i].title);
    }
    fs.writeFile(`./docs/docs${obj.item.path}.md`, data.content, function (err) {
        if (err) {
            logger.error(`index:::/update:::err:${JSON.stringify(err)}`)
            res.json({
                status: 400,
                msg: '更新失败'
            })
        }
        reBuildDocs('/update');
        res.json({
            status: 200
        })
    })
});
//删除文档
router.post('/delete', function(req, res) {
    let data = req.body;
    if (!data.path || !data.user) {
        res.json({
            status: 400,
            msg: '数据校验失败'
        })
    }
    path = JSON.parse(data.path);
    setDataLog.setLog(data.user, `删除文档: ${path[0]}`);
    let sidebar = Config.themeConfig.sidebar;
    let obj = {children:sidebar,item:{}};
    json = setSideBar(obj, path, path.length-1);
    let config = Config;
    config.themeConfig.sidebar = sidebar;
    fs.writeFile(`./docs/docs/.vuepress/config.js`, `module.exports = ${JSON.stringify(config)}`, function (error) {
        if (error) {
            logger.error(`index:::/delete:::error:${JSON.stringify(error)}`)
            res.json({
                status: 400,
                msg: '导航更新失败'
            })
        }
        reBuildDocs('/delete');
        res.json({
            status: 200
        })
    })
});
//获取文档
router.get('/content', function (req, res) {
    let data = req.query;
    if (!data.path) {
        res.json({
            status: 400,
            msg: 'path不能为空'
        })
    }
    let sidebar = Config.themeConfig.sidebar;
    let path = JSON.parse(data.path).map(ele => {
        return {
            title: ele,
            item: {}
        }
    });
    let obj = { children: sidebar, item: {}};
    for (let i = path.length - 1; i >= 0; i--) {
        obj = findItem(obj.children, path[i].title);
    }
    if (!obj.item || (obj.item && !obj.item.path)) {
        res.json({
            status: 400,
            msg: '文件未找到'
        })
    }
    fs.readFile(`./docs/docs${obj.item.path}.md`, 'utf-8', function (err, data) {
        if (err) {
            logger.error(`index:::/content:::err:${JSON.stringify(err)}`)
            res.json({
                status: 400,
                msg:'404'
            })
        }
        res.json({
            status: 200,
            result: data
        })
    })
});
//获取导航
router.get('/menu', function (req, res) {
    if (Config.themeConfig.sidebar) {
        res.json({
            status: 200,
            result: Config.themeConfig.sidebar
        })
    } else {
        res.json({
            status: 200,
            result: []
        })
    }
});
//更新导航
router.post('/menu/update', function (req, res) {
    let data = req.body;
    if (!data.menu || !data.user) {
        res.json({
            status: 400,
            msg: '数据校验失败'
        })
    }
    setDataLog.setLog(data.user, `更新导航`);
    let config = Config;
    config.themeConfig.sidebar = JSON.parse(data.menu);
    fs.writeFile(`./docs/docs/.vuepress/config.js`, `module.exports = ${JSON.stringify(config)}`, function (error) {
        if (error) {
            logger.error(`index:::/menu/update:::error:${JSON.stringify(error)}`)
            res.json({
                status: 400,
                msg: '导航更新失败'
            })
        }
        reBuildDocs('/menu/update');
        res.json({
            status: 200
        })
    });
    
});
reBuildDocs = (url) => {
    exec('npm run docs:build && rm -rf docs/.vuepress/docs/* && mv docs/.vuepress/dist/* docs/.vuepress/docs/', {cwd:'./docs'}, function(error, stdout, stderr) {
        if (error) {
            logger.error(`index:::${url}:::reBuildDocs:::error:${JSON.stringify(error)}`);
        }
    });
}
setSideBar = (jsonArr, path, index, obj) => {
    console.log(obj)
    if (!jsonArr.children) {
        return null;
    }
    children = jsonArr.children;
    // 遍历每一层children
    for(let i=0;i<children.length;i++){
        if(children[i].title==path[index]){
            if (!index) {   // 递归最后一层
                if (obj && children[i].children) {  // 插入值
                    children[i].children.push(obj);
                    return null;
                } else if (obj) { 
                    children[i]['children'] = [obj];
                    return null;
                } else {    // 删除
                    fs.unlink(`./docs/docs/${children[i].path}.md`, function (err) {
                        if (err) {
                            logger.error(`index:::setSideBar:::err:${JSON.stringify(err)}`)
                            console.log(err);
                        }
                    })
                    children.splice(i,1)
                    return children[i];
                }
            }
            index -= 1;
            return setSideBar(children[i], path, index, obj);
        }
    }

    return null;
}
findItem = (arr, title) => {
    if (!arr) {
        return {children: null,item:null}
    }
    for(let i=0;i<arr.length;i++){
        if(arr[i].title==title){
            return {children: arr[i].children?arr[i].children:null,item:arr[i]};
        }
    }
    return {children:null,item:null};
}
randomNum= (range)=> {
    var str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    range = range || 10;
    for(var i=0; i<range; i++){
        str += arr[Math.round(Math.random() * (arr.length - 1))];
    }
    return str;
}
module.exports = router;