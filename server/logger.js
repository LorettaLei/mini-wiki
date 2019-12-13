var log4js = require('log4js');  

log4js.configure({
  appenders: { 
    cheese: { 
      type:"dateFile",  
      filename:"./log/log4js/",  
      pattern: "log4js_yyyyMMdd.log",  
      alwaysIncludePattern: true,     //文件名是否始终包含占位符  
      absolute: false,                //filename是否绝对路径  
    } 
  },
  categories: { 
    default: { 
      appenders: ['cheese'], 
      level: 'info' 
    } 
  }
});

const logger = log4js.getLogger('cheese');
  
exports.logger = logger;