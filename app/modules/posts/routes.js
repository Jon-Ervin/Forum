
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
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author", function (err, results, fields) {
        if (err) return res.send(err);
        req.posttab = results;
        return next();
    });
}
function fmypost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE useraccount.loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.myposttab = results;
        return next();
    });
}
function fupdate(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM(SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.edit FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T WHERE edit= 'true';", (err, results, fields) => {
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

function render(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/index', { categorytab: req.categorytab , posttab: req.posttab});
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
function editrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/edit', { categorytab: req.categorytab , myposttab: req.myposttab});
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
function delrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      res.render('posts/views/del', { categorytab: req.categorytab , myposttab: req.myposttab});
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

router.get('/', fcategory, fpost, render);
router.get('/add', fcategory, addrender);
router.get('/edit', fcategory, fmypost, editrender);
router.get('/update', fcategory, fupdate, updaterender);
router.get('/del', fcategory, fmypost, delrender);
router.get('/invalid', fcategory, invalidrender);

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
    db.query("INSERT INTO post (author, p_category, p_title, p_content, p_date,edit) VALUES ( (SELECT username FROM useraccount WHERE loggedin= 'true'), (SELECT categoryname FROM categorytab WHERE opened= 'true'), '"+req.body.title+"', '"+req.body.content+"' , '"+req.body.date+"','false' )", (err, results, fields) => {
        if (err) console.log(err);
        res.redirect('/posts');
    });
  }

});
router.post('/edit',(req,res) => {
  var db = require('../../lib/database')();
  db.query("SELECT T.id FROM useraccount INNER JOIN (SELECT post.id , post.author FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true') AS T ON useraccount.username = T.author WHERE loggedin= 'true' AND id= '"+req.body.pid+"'", (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0]){
        res.redirect('/posts/edit');
      }
      else{
        db.query("UPDATE post SET edit= 'true' WHERE id='"+req.body.pid+"'", (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/posts/update');
        });
      }
  });
});
router.post('/update', (req,res) => {
  var db = require('../../lib/database')();
  var x = 0;
  if(req.body.title===""){
    res.redirect('/posts/update');
    x = 1;
  }
  if(req.body.content===""){
    res.redirect('/posts/update');
    x = 1;
  }
  if(req.body.date===""){
    res.redirect('/posts/update');
    x = 1;
  }
  if(x===0){
    db.query("UPDATE post SET p_title='"+req.body.title+"', p_content='"+req.body.content+"', p_date='"+req.body.date+"' WHERE edit='true'", (err, results, fields) => {
          if (err) console.log(err);
          res.redirect('/posts');
    });
    db.query("UPDATE post SET edit= 'false' WHERE edit= 'true'", (err, results, fields) => {
        if (err) console.log(err);
    });
  }
});
router.post('/del',(req,res) => {
  var db = require('../../lib/database')();
  db.query("SELECT T.id FROM useraccount INNER JOIN (SELECT post.id , post.author FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true') AS T ON useraccount.username = T.author WHERE loggedin= 'true' AND id= '"+req.body.pid+"'", (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0]){
        res.redirect('/posts/del');
      }
      else{
        db.query("DELETE FROM post WHERE id='"+req.body.pid+"'", (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/posts');
        });
      }
  });
});

exports.posts = router;
