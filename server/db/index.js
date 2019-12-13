var mongoose = require('mongoose');
var DB_CONN_STR = 'mongodb://127.0.0.1:27017/miniwiki'; 

mongoose.connect(DB_CONN_STR, (err, res) => {
  if (err) {
    console.log(err)
  }
});
// mongoose.set('useFindAndModify', false)

module.exports = mongoose;
