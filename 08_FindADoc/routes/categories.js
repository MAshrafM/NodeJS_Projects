var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');

var client = new cassandra.Client({
    contactPoints:['127.0.0.1']
});

client.connect(function(err, result){
    console.log('Cassandra Connected');
});


router.get('/add', function(req, res, next) {
  res.render('addcategory');
});

router.post('/add', function(req, res, next) {

    console.log("WE ARE HERE");

  var cat_id = cassandra.types.uuid();
  var query = "INSERT INTO findadoc.categories(cat_id, name) VALUES(?,?)";

  client.execute(query, [cat_id, req.body.name], {prepare: true},
  function(err, result){
      if(err){
          res.status(404).send({msg:err});
      } else {
          req.flash('success', "Category Added");
          res.location('/doctors');
          res.redirect('/doctors');
      }
  });
});

module.exports = router;