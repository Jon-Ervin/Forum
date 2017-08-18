
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
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'false'", function (err, results, fields) {
        if (err) return res.send(err);
        req.posttab = results;
        return next();
    });
}
function fmypost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'false' AND useraccount.loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.myposttab = results;
        return next();
    });
}
function fpinpost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.pinposttab = results;
        return next();
    });
}
function fmypinpost(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT T.id, T.p_title, T.author, useraccount.email, T.p_date, T.p_content FROM useraccount INNER JOIN ( SELECT post.id, post.p_title, post.author, post.p_date, post.p_content, post.pin  FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname  WHERE categorytab.opened='true' ) AS T ON useraccount.username= T.author WHERE T.pin = 'true' AND useraccount.loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        req.mypinposttab = results;
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
      res.render('posts/views/index', { categorytab: req.categorytab , pinposttab: req.pinposttab , posttab: req.posttab});
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
      res.render('posts/views/edit', { categorytab: req.categorytab , mypinposttab: req.mypinposttab , myposttab: req.myposttab});
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
      res.render('posts/views/del', { categorytab: req.categorytab , mypinposttab: req.mypinposttab , myposttab: req.myposttab});
    }
}
function pinrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      var db = require('../../lib/database')();
      db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
          if (err) console.log(err);

          if (results[0].usertype==='admin'){
            res.render('posts/views/pin', { categorytab: req.categorytab , posttab: req.posttab});
          }
          else{
            res.redirect('invaliduser');
          }
      });
    }
}
function unpinrender(req,res) {
    if (!req.categorytab[0]){
      res.redirect('/home');
    }
    else{
      var db = require('../../lib/database')();
      db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
          if (err) console.log(err);

          if (results[0].usertype==='admin'){
            res.render('posts/views/unpin', { categorytab: req.categorytab , pinposttab: req.pinposttab});
          }
          else{
            res.redirect('invaliduser');
          }
      });
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

router.get('/', fcategory, fpinpost, fpost, render);
router.get('/add', fcategory, addrender);
router.get('/edit', fcategory, fmypinpost, fmypost, editrender);
router.get('/update', fcategory, fupdate, updaterender);
router.get('/del', fcategory, fmypinpost, fmypost, delrender);
router.get('/pin', fcategory, fpost, pinrender);
router.get('/unpin', fcategory, fpinpost, unpinrender);
router.get('/invalid', fcategory, invalidrender);
router.get('/invaliduser', fcategory, invaliduserrender);

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
router.post('/pin',(req,res) => {
  var db = require('../../lib/database')();
  db.query("SELECT post.id FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname WHERE categorytab.opened='true' AND post.id= '"+req.body.pid+"' AND post.pin= 'false'", (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0]){
        res.redirect('/posts/pin');
      }
      else{
        db.query("UPDATE post SET pin= 'true' WHERE id='"+req.body.pid+"'", (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/posts');
        });
      }
  });
});
router.post('/unpin',(req,res) => {
  var db = require('../../lib/database')();
  db.query("SELECT post.id FROM post INNER JOIN categorytab ON post.p_category= categorytab.categoryname WHERE categorytab.opened='true' AND post.id= '"+req.body.pid+"' AND post.pin= 'true'", (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0]){
        res.redirect('/posts/unpin');
      }
      else{
        db.query("UPDATE post SET pin= 'false' WHERE id='"+req.body.pid+"'", (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/posts');
        });
      }
  });
});

exports.posts = router;
