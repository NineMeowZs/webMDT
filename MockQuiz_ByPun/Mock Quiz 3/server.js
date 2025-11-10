const express = require('express');
const bodyParser = require(body-parser);
const cookieParser = requrie('cookie-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.static('public'));
app.use(bodyParser.jason());
app.use(cookieParser());

const con = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "mydb"
});

con.connect(err =>{
    if(err) throw err;
    console.log("mySQl connected!");
});

app.listen(port, ()=> {
    console.log('server running at http://localhost:${port}');
});

app.post('/register', (req,res) => {
    const { username , password } = req.body;

    let sql = "INSERT INTO userInfo (username, password) VALUE (?,?)";
    con.query(sql, [username, password], (err, result)=>{
        if(err){
            console.error(err);
        res.status(500).json({status: 'error' , message: 'Database error '});
        return;
        }
        console.log("New user created!");
        res.json({status: 'success'});
    });
});

app.post('/login', (req, res) => {
    const {username, password} = req.body;

    let sql = "Select * FROM userIndo WHERE username = ? AND password = ?";

    con.query(sql, [username, password], (err, result) => {
        if(err){
            console.error(err);
            res.status(500).json({status: 'error', messsage: 'Database error'});
            return;
        }
        
        if (result.length > 0){
            res.cookie('username', result[0].username, {maxAge: 900000});
            res.json({status: 'success'});
        } else {
            res.status(401).json({status: 'failure', message: 'invalid credentials'});

        }
    });
});

function checkAuth(req, res, next){
    console.log("Checking cookie:", req.cookie.username);
    if(req.cookie.username){
        next();
    }else {
        res.status(401).json({status: 'error', message: 'Not authorized'});
    }
}

app.get('/get-feed-posts', checkAuth, (req, res)=>{
    let sql = "SELECT * FROM posts";
    con.query(sql, (err , posts) => {
        if(err) throw err;
        res.json(posts);
    });
});
