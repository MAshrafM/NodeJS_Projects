var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
var util = require('util');

var client = new cassandra.Client({
    contactPoints:['127.0.0.1']
});

client.connect(function(err, result){
    console.log('Cassandra Connected');
});


router.get('/', function(req, res, next) {
    if(req.query.state){
        var query = "SELECT * FROM findadoc.doctors WHERE state = ?";
        client.execute(query, [req.query.state], function(err, results){
            if (err){
                res.status(404).send({msg:err});
            } else {
                res.render('doctors', {
                    doctors: results.rows
                });
            }
        });
    } else {
        var query = "SELECT * FROM findadoc.doctors";
        client.execute(query, [], function(err, results){
            if (err){
                res.status(404).send({msg : err});
            } else {
                res.render('doctors', {
                    doctors: results.rows
                });
            }
        });
    }

});

router.get('/add', function(req, res, next) {
    var query = "SELECT * FROM findadoc.categories";
    client.execute(query, [], function(err, results){
        if (err){
            res.status(404).send({msg : err});
        } else {


            console.log(util.inspect(results.rows, false, null));

            res.render('adddoctor', {
                categories: results.rows
            });
        }
    });
});

router.post('/add', function(req, res, next) {
  var doc_id = cassandra.types.uuid();
  var query = "INSERT INTO findadoc.doctors(doc_id, full_name, category, new_patients, graduation_year, practice_name, street_address, city, state, zip) VALUES(?,?,?,?,?,?,?,?,?,?)";

  client.execute(query, [doc_id, req.body.full_name, req.body.category, req.body.new_patients, req.body.graduation_year, req.body.practice_name, req.body.street_address, req.body.city, req.body.state, req.body.zip], {prepare: true},
  function(err, results){
      if(err){
          res.status(404).send({msg:err});
      } else {
          req.flash('success', "Doctor Added");
          res.location('/doctors');
          res.redirect('/doctors');
      }
  });
});

router.get('/details/:id', function(req, res, next) {
    var query = "SELECT * FROM findadoc.doctors WHERE doc_id = ?";
    client.execute(query, [req.params.id], function(err, result){
        if (err){
            res.status(404).send({msg:err});
        } else {
            res.render('details', {
                doctor: result.rows['0']
            });
        }
    });
});

router.get('/category/:name', function(req, res, next) {
    var query = "SELECT * FROM findadoc.doctors WHERE category = ?";
    client.execute(query, [req.params.name], function(err, results){
        if (err){
            res.status(404).send({msg:err});
        } else {
            res.render('doctors', {
                doctors: results.rows
            });
        }
    });
});


module.exports = router;