'use strict';

var Book = require('../models/book');


module.exports = function (router) {
    router.get('/', function (req, res) {
      Book.find({}, function(err, books){
        if(err){
          console.log(err);
        }
        books.forEach(function(book){
          book.truncText = book.truncText(150);
        })
        var model = {
          books: books
        };
        res.render('index', model);
      });
    });

};
