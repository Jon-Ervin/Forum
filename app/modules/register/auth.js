
module.exports= (req,res,next)=>{
var db = require('../../lib/database')();
var x = 0;
if (req.body.email === ""){
  res.redirect('/register');
  x=1;
}
if (req.body.bday === ""){
  res.redirect('/register');
  x=1;
}
if(x===0){
  db.query("SELECT username FROM useraccount WHERE username='"+req.body.username+"'", (err, results, fields) => {
      if (err) console.log(err);
      if(!results[0] && req.body.username!="")
        next();
      else {
        res.redirect('/register');
      }
  });
}

}
