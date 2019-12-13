let mongoose = require('.');

let Schema = mongoose.Schema;

let userSchema = Schema({
    account: {
        type: String,
        required: true
    },
    passwd: {
        type: String,
        required: true
    },
    username: { 
        type: String,
        required: true
    },
    admin: Boolean,
    active: Boolean,
    created: Number,
    updated: Number,
    lastLogin: Number
});

let user = mongoose.model('User', userSchema);

module.exports = user;