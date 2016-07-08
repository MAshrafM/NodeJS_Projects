var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var db = require('monk')('localhost/nodeblog');
var multer  = require('multer');

var upload = multer({ dest: './public/images/uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts){
    res.render('index', {"posts": posts, "title": "Posts"});
  });
});

router.get('/add', function(req, res, next){
  var categories = db.get('categories');
  categories.find({}, {}, function(err, categories){
    res.render('addpost', {
      "title": "Add Post",
      "categories": categories
    });
  });
  
});

router.post('/add', [upload.single('thumbimage'), function(req, res, next){
  // get form values
  var title = req.body.title,
      category = req.body.category,
      body = req.body.body;
  var date = new Date();
  
  if(req.file){
    var thumbImageOName = req.file.originalname,
        thumbImageName = req.file.filename,
        thumbImageMime = req.file.mimetype,
        thumbImagePath = req.file.path,
        thumbImageExt = req.file.extension,
        thumbImageSize = req.file.size;
  }
  else{
    var thumbImageName = 'noimage.png';
  }
  
  // Validattion
  req.checkBody('title', 'Title Field is required').notEmpty();
	req.checkBody('body', 'Body Field is required').notEmpty();
  
  // check errors
  var errors = req.validationErrors();
  
  if(errors){
    var categories = db.get('categories');
    categories.find({}, {}, function(err, categories){
      res.render('addpost', {
        "errors": errors,
        "title": title,
        "body": body,
        "categories": categories
      });
    });
  }
  else{
    var posts = db.get('posts');
    posts.insert({
      "title": title,
      "body": body,
      "category": category,
      "date": date,
      "thumbimage": thumbImageName
    }, function(err, post){
      if(err) {
        res.send("There was an issue submitting the post");
      }
      else{
        req.flash('success', 'Post Submitted');
        res.location('/');
        res.redirect('/');
      }
    });
  }
}]);

module.exports = router;
