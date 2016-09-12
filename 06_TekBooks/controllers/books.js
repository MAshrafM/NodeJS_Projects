'use strict';

//var IndexModel = require('../models/index');
var Book = require('../models/book');
var Category = require('../models/category');

module.exports = function (router) {

    //var model = new IndexModel();

    router.get('/', function (req, res) {
        
        
        res.render('index');
        
        
    });

    router.get('/details/:id', function (req, res) {
        
        Book.findOne({_id: req.params.id}, function(err, book){
          if(err){
            console.log(err);
          }
          
          var model = {
            book : book
          };
          res.render('books/details', model)
        });      
        
    });
};
