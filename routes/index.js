var express = require('express');
var router = express.Router();
const db = require('./../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/restaurant' , function(req, res, next){
  db.getAllRestaurant((rows) => {
    res.render('restaurant' , {length : rows.length});
  });
  
});

router.get('/randomRestaurant' , function(req, res, next){
  const idx = req.query.idx;
  const params = {idx : idx};
  db.getOneRestaurant(params, (result)=>{
    res.send({result : result});
  });
});

router.get('/postRestaurant' , function(req, res, next){
  db.getAllRestaurant((rows) => {
    res.render('postRestaurant' , {rows : rows, length : rows.length});
  });
});
router.post('/postRestaurant' , function(req, res, next){
  console.log(req.body);
  const data = req.body;
  db.insertRestaurant(data, (result, err)=>{
    if(err) res.send({flag : false});
    res.send({flag:true, result:result});
  });
});
router.post('/deleteRestaurant' , function(req, res, next){
  console.log(req.body);
  const data = req.body;
  db.deleteRestaurant(data, (result, err)=>{
    if(err) res.send({flag : false});
    res.send({flag:true, result:result});
  });
});
module.exports = router;
