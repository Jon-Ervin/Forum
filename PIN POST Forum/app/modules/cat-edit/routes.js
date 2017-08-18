
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
                res.render('cat-edit/views/index');
              }
              else{
                res.redirect('/invalid');
              }
          });
        }
    });
});

router.post('/', (req, res) => {
  if(req.body.category===""){
    res.redirect('/edit');
  }
  else{
    var db = require('../../lib/database')();
    db.query("UPDATE categorytab SET categoryname='"+req.body.category+"' WHERE id='"+req.body.id+"'", (err, results, fields) => {
        if (err) console.log(err);
        res.redirect('/home');
    });
  }
});

exports.edit = router;
