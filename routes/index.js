var express = require('express');
var router = express.Router();
const db = require('./../db');
const fs = require('fs');

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
  const length = req.query.length;
  const random = Math.floor(Math.random()*(length))+1;
  const params = {idx : random};
  db.getOneRestaurant(params, (result)=>{
    res.send({result : result});
  });
});

router.get('/placeRandomRestaurant' , function(req, res, next){

  console.log(req.query);
  let params = {};
  params.lat = req.query.lat;
  params.logt = req.query.logt;
  params.distance = 1;
  let restaurantApiCount;
  new Promise((resolve, reject)=>{
    db.getRestaurantApiCountByPlace(params, (result)=>{
      restaurantApiCount = result;
      resolve();
    });
  }).then(()=>{
    const random = Math.floor(Math.random()*(restaurantApiCount[0].CNT))+1;
    params.random = random;
    db.getRestaurantApiByPlace(params, (result)=>{
    res.send({result : result});
  });
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

/* router.get('/readFile' , function(req, res, next){
  const jsonFile = fs.readFileSync('public/china.json','utf-8');
  console.log('파일 파싱');

  const jsonData = JSON.parse(jsonFile);
  console.log('json 파싱');
  
  for(let i=0; i<jsonData.length; i++){
    if(jsonData[i].BSN_STATE_NM == '영업'){
      db.insertRestaurantApi(jsonData[i], (result, err)=>{
        if(err){
          console.log('실패');
        }else{
          console.log('성공 > '+i);
        }
      });
    }
  }
  console.log('파일 읽기 종료');
}); */

module.exports = router;
