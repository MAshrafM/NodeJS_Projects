var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/register', function(req,res,next){
	var name = req.body.name,
		email = req.body.email,
		username = req.body.username,
		password = req.body.password,
		password2 = req.body.password2;
	
	//check for image fields
	if(req.files && req.files.profileimage){
		console.log('Uploading File...');
		var profileImageName = req.files.profileimage.originalname;
			profileImageServer = req.files.profileimage.name,
			profileImageMime = req.files.profileimage.mimetype,
			profileImagePath = req.files.profileimage.path,
			profileImageExt = req.files.profileimage.extension,
			profileImageSize = req.files.profileimage.size;
	}
	else{
		var profileImageServer = "noimage.png";
	}
	
	// Validator
	req.checkBody('name', 'Name Field is required').notEmpty();
	req.checkBody('email', 'Email Field is required').notEmpty();
	req.checkBody('email', 'Email not Valid').isEmail();
	req.checkBody('username', 'UserName Field is required').notEmpty();
	req.checkBody('password', 'Password Field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	
	// errors
	var errors = req.validationErrors();
	
	if(errors){
		res.render('register', {
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		})
	}
	else{
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileimage: profileImageServer
		});
		
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});
		
		req.flash('success', "You are now registered and may log in");
		res.location('/');
		res.redirect('/');
	}
	
});

module.exports = router;
