const Log = require('../db/dataLog');

module.exports = {
    setLog: function (user, title) {
        Log.create({
            user: user,
            created: new Date().getTime(),
            title: title,
            _user: user
        }, (err, doc) => {
            if (err) {
                logger.error(`log::/create::err:${JSON.stringify(err)}`);
            }
        })
    }
}