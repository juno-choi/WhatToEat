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
    connection.query(`SELECT * FROM RESTAURANT WHERE IDX = ?`, [params.idx], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}
function insertRestaurant(params, callback){
    connection.query(`INSERT INTO RESTAURANT (KIND, SEPERATE, NAME, MENU) VALUES (?,?,?,?);`, [params.kind, params.seperate, params.name, params.menu], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}
function deleteRestaurant(params, callback){
    connection.query(`DELETE FROM RESTAURANT WHERE IDX = ?;`, [params.idx], (err, rows, fields) =>{
        if(err) throw err;
        callback(rows);
    });
}

module.exports = {
    getAllTester, getAllRestaurant, getOneRestaurant, insertRestaurant, deleteRestaurant

}