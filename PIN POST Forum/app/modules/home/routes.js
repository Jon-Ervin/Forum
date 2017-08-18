
var express = require('express');

var router = express.Router();

function username(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM useraccount WHERE loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        if (!results[0]){
          res.render('home/views/invalid');
        }
        req.user = results;
        return next();
    });
  }
function categoryname(req, res, next){
    var db = require('../../lib/database')();
    db.query("SELECT * FROM categorytab", function (err, results, fields) {
        if (err) return res.send(err);
        req.category = results;
        return next();
    });
}

function render(req,res) {
    var db = require('../../lib/database')();
    db.query("UPDATE categorytab SET opened='false' WHERE opened='true'", (err, results, fields) => {
        if (err) console.log(err);
    });
    res.render('home/views/index', { useraccount: req.user , categorytab: req.category});
}

router.get('/', username, categoryname, render);

router.post('/',(req,res) => {
    var db = require('../../lib/database')();
    db.query("SELECT categoryname FROM categorytab WHERE categoryname='"+req.body.category+"'", (err, results, fields) => {
        if (err) console.log(err);
        if (!results[0]){
          res.redirect('/invalid/category');
        }
        else{
          db.query("UPDATE categorytab SET opened='true' WHERE categoryname='"+req.body.category+"'", (err, results, fields) => {
              if (err) console.log(err);
              res.redirect('/posts');
          });
        }
    });
});

exports.home = router;
