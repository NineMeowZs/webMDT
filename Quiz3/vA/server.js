const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// ใส่ค่าตามที่เราตั้งไว้ใน mysql 
// ต้องมี database db2 ก่อนรัน server.js นะ
const con = mysql.createConnection({
    host: "localhost",
    user: "root", 
    password: "", 
    database: "db2"
})

// เชื่อมต่อ database ทำให้สมบูรณ์
con.connect(err => {
        if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
 
})

let tablename = "testquiz3";

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

// database initialization
const tableData = [
    { id: 1, name: 'John Doe', email: 'johndoe@gmail.com', age: 28 },
    { id: 2, name: 'Mikasa Ackerman', email: 'mikasaackerman@gmail.com', age: 24 },
    { id: 3, name: 'Eren Yeager', email: 'erenyeager@gmail.com', age: 22 },
    { id: 4, name: 'Armin Arlert', email: 'arminarlert@gmail.com', age: 23 },
    { id: 5, name: 'Levi Ackerman', email: 'leviackerman@gmail.com', age: 40 },
	{ id: 6, name: 'Test Adams', email: 'testadams@gmail.com', age: 33 }
  ];

const initDB = async() => {
    let check = await queryDB(`
    SELECT COUNT(*) AS count
    FROM information_schema.tables
    WHERE table_schema = DATABASE()
    AND table_name = '${tablename}'`);
    console.log(check[0].count);
    if (check[0].count > 0) {
        console.log("Table already initialized : dropping table...and recreating");
        await queryDB(`DROP TABLE IF EXISTS ${tablename}`);
        
    }
        let sql = `CREATE TABLE IF NOT EXISTS ${tablename} (student_id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, student_name VARCHAR(255), student_email VARCHAR(100),student_age INT)`;
        let result = await queryDB(sql);
        for (let i = 0; i < tableData.length; i++) {
            sql = `INSERT INTO ${tablename} (student_name, student_email, student_age) VALUES ("${tableData[i].name}", "${tableData[i].email}", ${tableData[i].age})`;
            result = await queryDB(sql);
        }
        console.log("Database initialized with sample data");
    
}

initDB();

// --------------------------------------------------------
// ทำส่วนนี้ให้สมบูรณ์

app.get("/getDB", async (req,res) => {
    let sql = `SELECT id, username, email FROM ${tablename}`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
    console.log(result);
    res.json(result);
})


app.post("/deleteDB", async (req,res) => {
  let sql = `DELETE FROM ${tablename} WHERE username ='${req.body.username}'`;
    let result = await queryDB (sql);
    console.log(result);
    res.end("Record deleted successfully");

})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});