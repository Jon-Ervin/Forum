
var express = require('express');

var router = express.Router();

router.get('/', (req, res) => {
  res.render('invalid/views/index');
});

router.get('/category', (req, res) => {
  res.render('invalid/views/category');
});

exports.invalid= router;
