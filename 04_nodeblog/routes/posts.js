var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var db = require('monk')('localhost/nodeblog');
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname );
  }
})
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  var posts = db.get('posts');
  posts.find({}, {}, function(err, posts){
    res.render('index', {"posts": posts, "title": "Posts"});
  });
});

router.get('/show/:id', function(req, res, next){
  var posts = db.get('posts');
  var id = new ObjectID(req.params.id);
  posts.findOne({"_id": id}, {}, function(err, post){
    if(err) throw err;
    res.render('showpost', {
      "title": post.title,
      "post": post
    });
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

router.post('/addcomment', function(req,res,next){
  var title = req.body.title;
  var name = req.body.name;
  var postId = req.body.postid;
  var body = req.body.body;
  var commentDate = new Date();
  var posts = db.get('posts');
  var id = new ObjectID(postId);
  
  req.checkBody('title', "Title Field is required").notEmpty();
  req.checkBody('name', "Name Field is required").notEmpty();
  req.checkBody('body', "Body Field is required").notEmpty();

  var errors = req.validationErrors();
  if(errors){
    posts.findOne({"_id": id}, {}, function(err, post){
      if(err) throw err;
      res.render('showpost', {
        "title": post.title,
        "post": post,
        "errors": errors
      });
    });
  }
  else{
    var comment = {
      "title": title,
      "name": name,
      "body": body,
      "data": commentDate
    };
    posts.update({
      "_id": id
    },
    {
      $push:{
        "comments": comment
      }
    }, function(err, doc){
      if(err) throw err;
      req.flash('success', 'Comment created');
      res.location('/posts/show/'+postId);
      res.redirect('/posts/show/'+postId);
    }
    );
  }
});

router.post('/add', [upload.single('thumbimage'), function(req, res, next){
  // get form values
  var title = req.body.title,
      category = req.body.category,
      body = req.body.body;
  var date = new Date();
  
  console.log(req.file);
  if(req.file){
    var thumbImageOName = req.file.originalname,
        thumbImageName = req.file.filename,
        thumbImageMime = req.file.mimetype,
        thumbImagePath = req.file.path,
        thumbImageExt = thumbImageMime.split('/')[1],
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
