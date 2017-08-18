var auth = require( './auth')
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
    var db = require('../../lib/database')();
    db.query("UPDATE useraccount SET loggedin= 'false' WHERE loggedin= 'true'", (err, results, fields) => {
        if (err)
          console.log(err);
      });
    res.render('register/views/index');
});

router.post('/',auth, (req, res) => {
    var db = require('../../lib/database')();
    if(req.body.password === req.body.confirm && req.body.password != ""){
    db.query("INSERT INTO useraccount (username,password,email,birthdate,usertype,loggedin) VALUES ('"+req.body.username+"','"+req.body.password+"','"+req.body.email+"','"+req.body.bday+"','normal','false')", (err, results, fields) => {
        if (err) {
          console.log(err);
          res.redirect('/register');
        }
        res.redirect('/login');
    });
    }
    else{
      res.redirect('/register');
    }
});

exports.register = router;
