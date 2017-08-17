
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    var db = require('../../lib/database')();
    db.query("SELECT * FROM useraccount WHERE loggedin= 'true'", function (err, results, fields) {
        if (err) return res.send(err);
        if (!results[0]){
          res.render('home/views/invalid');
        }
        else{
          db.query("SELECT usertype FROM useraccount WHERE loggedin= 'true'", (err, results, fields) => {
              if (err) console.log(err);

              if (results[0].usertype==='admin'){
                res.render('cat-add/views/index');
              }
              else{
                res.redirect('/invalid');
              }
          });
        }
    });
});

router.post('/', (req, res) => {
  var db = require('../../lib/database')();
  db.query("SELECT categoryname FROM categorytab WHERE categoryname= '"+req.body.category+"'", (err, vld, fields) => {
      if (err) console.log(err);
      if(!vld[0] && req.body.category!= ""){
        db.query("INSERT INTO categorytab(categoryname,opened) VALUES ('"+req.body.category+"','false')", (err, results, fields) => {
            if (err) console.log(err);
            res.redirect('/home');
        });
      }
      else{
        res.redirect('/add');
      }
  });

});

exports.add = router;
