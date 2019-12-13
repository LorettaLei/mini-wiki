let mongoose = require('.');

let Schema = mongoose.Schema;

let logSchema = Schema({
    user: String,
    created: Number,
    title: String,
    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

let log = mongoose.model('Log', logSchema);

module.exports = log;