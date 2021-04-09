const mysql = require('mysql');

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    port : 3306,
    database : 'NODE_DB'
});



function getAllTester(callback){
    connection.query(`SELECT * FROM TEST`, (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
        console.log(rows);
        let i = 0;
        rows.forEach(element => {
            console.log(i++);
        });
    });
}

function getAllRestaurant(callback){
    connection.query(`SELECT * FROM RESTAURANT ORDER BY IDX DESC`, (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
        //console.log(rows);
    });
}
function getOneRestaurant(params, callback){
    connection.query(
        `select * from (
            SELECT @rownum:=@rownum+1 as rownum, r.* 
            FROM RESTAURANT as r, (select @rownum:=0) tmp) 
        as x 
        where rownum = ?`, [params.idx], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

function getOneRestaurantApi(params, callback){
    connection.query(
        `select * from (
            SELECT @rownum:=@rownum+1 as rownum, r.* 
            FROM RESTAURANT_API as r, (select @rownum:=0) tmp) 
        as x 
        where rownum = ?`, [params.idx], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}
function insertRestaurant(params, callback){
    connection.query(`INSERT INTO RESTAURANT (KIND, SEPERATE, NAME, MENU) VALUES (?,?,?,?)`, [params.kind, params.seperate, params.name, params.menu], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}
function deleteRestaurant(params, callback){
    connection.query(`DELETE FROM RESTAURANT WHERE IDX = ?`, [params.idx], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

function insertRestaurantApi(json, callback){
    connection.query(`INSERT INTO RESTAURANT_API (SIGUN_NM, BIZPLC_NM, SANITTN_BIZCOND_NM, REFINE_ROADNM_ADDR, REFINE_LOTNO_ADDR, REFINE_ZIP_CD, REFINE_WGS84_LAT, REFINE_WGS84_LOGT) VALUES (?,?,?,?,?,?,?,?)`, 
                                                [json.SIGUN_NM, json.BIZPLC_NM, json.SANITTN_BIZCOND_NM, json.REFINE_ROADNM_ADDR, json.REFINE_LOTNO_ADDR, json.REFINE_ZIPNO, json.REFINE_WGS84_LAT, json.REFINE_WGS84_LOGT], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

function getRestaurantApiCount(callback){
    connection.query(`SELECT COUNT(IDX) AS CNT FROM RESTAURANT_API`, (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
        return rows[0].CNT;
    });
}

function getRestaurantApiCountByPlace(param, callback){
    connection.query(`
    select count(idx) as CNT from
    (
        SELECT *,
        (6371*acos(cos(radians(?))*cos(radians(REFINE_WGS84_LAT))*cos(radians(REFINE_WGS84_LOGT)
        -radians(?))+sin(radians(?))*sin(radians(REFINE_WGS84_LAT))))
        AS distance
        FROM RESTAURANT_API
        HAVING distance <= ?
    ) as x`,[param.lat, param.logt, param.lat, param.distance], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

function getRestaurantApiByPlace(param, callback){
    connection.query(`
    select * from (
        SELECT @rownum:=@rownum+1 as rownum, ra.*,
            (6371*acos(cos(radians(?))*cos(radians(REFINE_WGS84_LAT))*cos(radians(REFINE_WGS84_LOGT)
            -radians(?))+sin(radians(?))*sin(radians(REFINE_WGS84_LAT))))
            AS distance
        FROM RESTAURANT_API as ra, (select @rownum:=0) tmp
            HAVING distance <= ?
        ) as x where rownum = ? ;`,[param.lat, param.logt, param.lat, param.distance, param.random], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

module.exports = {
    getAllTester, getAllRestaurant, getOneRestaurant, insertRestaurant, deleteRestaurant, insertRestaurantApi, getOneRestaurantApi, getRestaurantApiCount, getRestaurantApiByPlace, getRestaurantApiCountByPlace

}