'user strict';

var mongoose = require('mongoose');

var db = function(){
  return {
    config: function(conf){
      mongoose.connect('mongodb://localhost/tekbooks');
      var db = mongoose.connection;
      db.on('error', console.error.bind(console, 'Connection Error'));
      db.once('open', function(){
        console.log('db connection open');
      });
    }
  };
};

module.exports = db();