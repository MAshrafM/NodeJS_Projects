var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');

router.get('/show/:category', function(req, res, next){
  var db = req.db;
  var posts = db.get('posts');
  posts.find({category: req.params.category}, {}, function(err, posts){
    res.render('index', {
      "title": req.params.category,
      "posts": posts
    });
  });
});

router.get('/add', function(req, res, next) {
  res.render('addcategory', {
    title: "Add Category"
  });
});

router.post('/add', function(req,res,next){
  var title = req.body.title;
  req.checkBody('title', "Title Field is required").notEmpty();
  var errors = req.validationErrors();
  if(errors){
    res.render('addcategory', {
      "errors": errors,
      "title": title
    });
  }
  else{
    var categories = db.get('categories');
    categories.insert({
      "title": title
    }, function(err, post){
      if(err) {
        res.send("There was an issue submitting the category");
      }
      else{
        req.flash('success', 'Category has been created.');
        res.location('/');
        res.redirect('/');
      }
    });
  }
});

module.exports = router;
