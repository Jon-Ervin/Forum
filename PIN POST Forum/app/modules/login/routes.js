
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
  var db = require('../../lib/database')();
  db.query("UPDATE useraccount SET loggedin= 'false' WHERE loggedin= 'true'", (err, results, fields) => {
      if (err)
        console.log(err);
    });
  res.render('login/views/index');
});

router.post('/', (req, res) => {
  var db = require('../../lib/database')();
  var x = 0;
  if(req.body.username === ""){
    res.redirect('/login');
    x = 1;
  }

  if(req.body.password === ""){
    res.redirect('/login');
    x = 1;
  }
  if(x===0){
    db.query("SELECT * FROM useraccount WHERE username= '"+req.body.username+"'", (err, results, fields) => {
        if (err) console.log(err);

        if(req.body.password === results[0].password)
        {
          db.query("UPDATE useraccount SET loggedin= 'true' WHERE username='"+req.body.username+"'", (err, results, fields) => {
              if (err){
                console.log(err);
                res.redirect('/login');
                }

              res.redirect('/home');
            });
        }

        else{
            res.redirect('/login');
        }
    });
  }

});

exports.login = router;
