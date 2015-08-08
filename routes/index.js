var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Blog' });
});

// get blog database
router.get('/viewlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(err,docs){
        res.render('viewlist', {
            "blogdata" : docs
        });
    });
});

// view blog data
router.get('/viewblog/:id', function(req,res){
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({},{},function(err,docs){
    res.render('viewblog', {
      "current" : req.params.id,
      "blogdata" : docs
    });
  });
});

// get new blog
router.get('/newblog', function(req,res,next){
  res.render('newblog', {title: 'New Blog'});
});

//adding new blog POST method
router.post('/addblog', function(req,res){
  var db = req.db;

  var blogName = req.body.blogname;
  var blogContent = req.body.blogcontent;
  var authorName = req.body.author;

  var collection = db.get('usercollection');

  // Submit to the DB
    collection.insert({
        "name" : blogName,
        "content" : blogContent,
        "author" : authorName,
        "comments" : []
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/viewlist");
        }
    });
});

//adding comment to blog
router.post('/addcomment/:id', function(req,res){
  var db = req.db;

  var id = req.params.id;
  var comment_name = req.body.comment_name;
  var comment = req.body.comment;

  var collection = db.get('usercollection');

  // Submit to the DB
    collection.update(
      {_id : id},
      { "$push":{comments : {"commenter" : comment_name, "comment" : comment}}},
      function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/viewlist");
        }
    });
  });

//adding comment to blog
router.get('/delete/:id', function(req,res){
  var db = req.db;

  var id = req.params.id;

  var collection = db.get('usercollection');

  // Submit to the DB
    collection.remove(
      {_id : id},
      function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/viewlist");
        }
    });
  });

module.exports = router;
