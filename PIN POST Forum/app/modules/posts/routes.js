
var express = require('express');

var router = express.Router();

function fcategory(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT categoryname FROM categorytab WHERE opened='true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.categorytab = results;
        return next();
    });
  }
function fpost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content, useraccount.loggedin FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'false'", function (err, results, fields) {
        if (err) return res.send(err);
        req.posttab = results;
        return next();
    });
}
function fmypost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content, useraccount.loggedin FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'false' AND useraccount.loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.myposttab = results;
        return next();
    });
}
function fpinpost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content, useraccount.loggedin FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.pinposttab = results;
        return next();
    });
}
function fmypinpost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content, useraccount.loggedin FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'true' AND useraccount.loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.mypinposttab = results;
        return next();
    });
}
function fupdate(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM(SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.edit FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T WHERE edit= 'true'", (err, results, fields) => {
        if (err) return res.send(err);
        if(!results[0]){
          res.redirect('/posts/invalid');
        }
        else{
          req.updatepost = results;
        }
        return next();
    });
}
function fuser(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
        if (err) return res.send(err);
        req.utype = results;
        //req.posttab.usertype = results.usertype;
        return next();
    });
}

function render(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/index', { categorytab: req.categorytab , pinposttab: req.pinposttab , posttab: req.posttab, utype: req.utype});
    }
}
function myrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/myposts', { categorytab: req.categorytab , mypinposttab: req.mypinposttab , myposttab: req.myposttab});
    }
}
function addrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/add', { categorytab: req.categorytab});
    }
}
function updaterender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      var db = require('../../lib/database')();
      res.render('posts/views/update', { categorytab: req.categorytab, updatepost: req.updatepost});
    }
}
function invalidrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/invalid', { categorytab: req.categorytab });
    }
}
function invaliduserrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/invaliduser', { categorytab: req.categorytab });
    }
}

router.get('/', fcategory, fpinpost, fpost, fuser, render);
router.get('/myposts', fcategory, fmypinpost, fmypost, myrender);
router.get('/add', fcategory, addrender);
router.get('/update', fcategory, fupdate, updaterender);
router.get('/invalid', fcategory, invalidrender);
router.get('/invaliduser', fcategory, invaliduserrender);

router.get('/del/:id', fcategory,(req,res) => {
  var db = require('../../lib/database')();
  if (!req.categorytab[0]){
    res.redirect('/home');
  }
  else{
    db.query("SELECT T.id FROM useraccount INNER JOIN (SELECT post.id , post.author FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true') AS T ON useraccount.username = T.author WHERE loggedin= 'true' AND id= '"+req.params.id+"'", (err, results, fields) => {
        if (err) console.log(err);
        if(!results[0]){
          res.redirect('/posts');
        }
        else{
          db.query("DELETE FROM post WHERE id='"+req.params.id+"'", (err, results, fields) => {
              if (err) console.log(err);
              res.redirect('/posts');
          });
        }
    });
  }
});
router.get('/edit/:id', fcategory,(req,res) => {
  var db = require('../../lib/database')();
  if (!req.categorytab[0]){
    res.redirect('/home');
  }
  else{
    db.query("SELECT T.id FROM useraccount INNER JOIN (SELECT post.id , post.author FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true') AS T ON useraccount.username = T.author WHERE loggedin= 'true' AND id= '"+req.params.id+"'", (err, results, fields) => {
        if (err) console.log(err);
        if(!results[0]){
          res.redirect('/posts');
        }
        else{
          db.query("UPDATE post SET edit= 'true' WHERE id='"+req.params.id+"'", (err, results, fields) => {
              if (err) console.log(err);
              res.redirect('/posts/update');
          });
        }
    });
  }
});
router.get('/pin/:id', fcategory,(req,res) => {
  var db = require('../../lib/database')();
  if (!req.categorytab[0]){
    res.redirect('/home');
  }
  else{
    db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
        if (err) console.log(err);

        if (results[0].usertype==='admin'){
          db.query("SELECT post.id FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname WHERE categorytab.opened='true' AND post.id= '"+req.params.id+"' AND post.pin= 'false'", (err, results, fields) => {
              if (err) console.log(err);
              if(!results[0]){
                res.redirect('/posts');
              }
              else{
                db.query("UPDATE post SET pin= 'true' WHERE id='"+req.params.id+"'", (err, results, fields) => {
                    if (err) console.log(err);
                    res.redirect('/posts');
                });
              }
          });
        }
        else{
          res.redirect('/posts/invaliduser');
        }
    });
  }
});
router.get('/unpin/:id', fcategory,(req,res) => {
  var db = require('../../lib/database')();
  if (!req.categorytab[0]){
    res.redirect('/home');
  }
  else{
    db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
        if (err) console.log(err);

        if (results[0].usertype==='admin'){
          db.query("SELECT post.id FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname WHERE categorytab.opened='true' AND post.id= '"+req.params.id+"' AND post.pin= 'true'", (err, result, fields) => {
              if (err) console.log(err);
              if(!result[0]){
                res.redirect('/posts');
              }
              else{
                db.query("UPDATE post SET pin= 'false' WHERE id='"+req.params.id+"'", (err, results, fields) => {
                    if (err) console.log(err);
                    res.redirect('/posts');
                });
              }
          });
        }
        else{
          res.redirect('/posts/invaliduser');
        }
    });

  }
});

router.post('/add',(req,res) => {
  var db = require('../../lib/database')();
  var x = 0;
  if(req.body.title === ""){
    res.redirect('/posts/add');
    x = 1;
  }
  if(req.body.date === ""){
    res.redirect('/posts/add');
    x = 1;
  }
  if(req.body.content === ""){
    res.redirect('/posts/add');
    x = 1;
  }
  if(x===0){
    db.query("INSERT INTO post (author, p_category, p_title, p_content, p_date,edit,pin) VALUES ( (SELECT username FROM useraccount WHERE loggedin= 'true'), (SELECT categoryname FROM categorytab WHERE opened= 'true'), '"+req.body.title+"', '"+req.body.content+"' , '"+req.body.date+"','false','false' )", (err, results, fields) => {
        if (err) console.log(err);
        res.redirect('/posts');
    });
  }
});
router.post('/update', (req,res) => {
  var db = require('../../lib/database')();
  var x = 0;
  if(!req.body.title){
    res.redirect('/posts/update');
    x = 1;
  }
  else if(!req.body.content){
    res.redirect('/posts/update');
    x = 1;
  }
  else if(!req.body.date){
    res.redirect('/posts/update');
    x = 1;
  }
  else if(x===0){
    db.query("UPDATE post SET p_title='"+req.body.title+"', p_content='"+req.body.content+"', p_date='"+req.body.date+"' WHERE edit='true'", (err, results, fields) => {
          if (err) console.log(err);
          res.redirect('/posts');
    });
    db.query("UPDATE post SET edit= 'false' WHERE edit= 'true'", (err, results, fields) => {
        if (err) console.log(err);
    });
  }
});

exports.posts = router;
