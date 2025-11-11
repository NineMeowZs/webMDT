const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// --- Multer Configuration ---
const storage = multer.diskStorage({
 destination: (req, file, callback) => {
 callback(null, 'public/img/');
 },
 filename: (req, file, cb) => {
 cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
 }
 });

const imageFilter = (req, file, cb) => {
 // Accept images only
 if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
 req.fileValidationError = 'Only image files are allowed!';
 return cb(new Error('Only image files are allowed!'), false);
}
 cb(null, true);
};

// Create the multer upload instance
const upload = multer({ storage: storage, fileFilter: imageFilter });

// --- Database Connection ---
// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
 host: "localhost",
 user: "root",
 password: "",
 database: "mydb"
});

con.connect(err => {
 if(err) throw(err);
 else{
 console.log("MySQL connected");
 }
});

// Define table names
let userTable = "userInfo";
let postTable = "posts"; // For Assignment 12

// Promise wrapper for MySQL queries, as shown in week12.pdf [cite: 754-768]
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

//--- ROUTES ---

// (Register) สร้างตารางและเพิ่มผู้ใช้ใหม่
app.post('/regisDB', async (req,res) => {
 let now_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const { username, email, password } = req.body;

    try {
        // 1. Create userInfo table if it doesn't exist (from week12.pdf [cite: 739-745])
        let userTableSql = `CREATE TABLE IF NOT EXISTS ${userTable} (
                            id INT AUTO_INCREMENT PRIMARY KEY, 
                            reg_date TIMESTAMP, 
                            username VARCHAR(255) UNIQUE, 
                            email VARCHAR(100),
                            password VARCHAR(100), 
                            img VARCHAR(100))`;
        await queryDB(userTableSql);

        // 2. Create posts table if it doesn't exist (for Assignment 12)
        let postTableSql = `CREATE TABLE IF NOT EXISTS ${postTable} (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user VARCHAR(255),
                            message TEXT,
                            post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                          )`;
        await queryDB(postTableSql);
        
        // 3. Insert the new user (from week12.pdf)
        // We give them a default profile picture to start
        let insertSql = `INSERT INTO ${userTable} (username, email, password, reg_date, img) 
                         VALUES ("${username}", "${email}", "${password}", "${now_date}", "default.png")`;
        
        await queryDB(insertSql);
        console.log("New user registered successfully");
        return res.redirect('login.html'); // Send to login page after successful registration

    } catch (err) {
        // This will often fail if the username is already taken (due to UNIQUE constraint)
        console.error("Error during registration:", err.code);
        return res.redirect('register.html'); // <-- FIXED
    }
});

// (Profile Picture Upload) อัปโหลดรูปและอัปเดต database
// =================== THIS LINE IS NOW CORRECTED ===================
app.post('/profilepic', upload.single('avatar'), async (req,res) => {
// ==================================================================
    try {
        const username = req.cookies.username;
        
        // Check if a file was actually uploaded
        if (!req.file) {
            console.log("No file uploaded.");
            return res.redirect('feed.html');
        }
        
        const newFilename = req.file.filename;

        // Update the database with the new filename
        await updateImg(username, newFilename);

        // Update the user's 'img' cookie
        res.cookie('img', newFilename);
        return res.redirect('feed.html');

    } catch (err) {
        console.error("Error uploading profile picture:", err);
        return res.redirect('feed.html');
    }
});

// (Helper Function) ฟังก์ชันสำหรับอัปเดต database
const updateImg = async (username, filen) => {
    // Use SQL UPDATE command from week12.pdf
    let sql = `UPDATE ${userTable} SET img = '${filen}' WHERE username = '${username}'`;
    try {
        await queryDB(sql);
        console.log(`Image updated for user: ${username}`);
    } catch (err) {
        console.error("Error in updateImg helper:", err);
    }
}

// (Logout) ล้างคุกกี้
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
});

// (Read Posts) อ่าน post ทั้งหมดจาก database
app.get('/readPost', async (req,res) => {
    try {
        // Use SQL SELECT * command from week12.pdf
        let sql = `SELECT * FROM ${postTable}`;
        let result = await queryDB(sql);
        
        // Convert RowDataPacket array to a plain object
        result = Object.assign({}, result); 
        res.json(result);
        
    } catch (err) {
        console.error("Error reading posts:", err);
        res.status(500).json({ error: "Failed to read posts" });
    }
});

// (Write Post) เขียน post ใหม่ลง database
app.post('/writePost', async (req,res) => {
    try {
        const { user, message } = req.body;
        
        // Use SQL INSERT command from week12.pdf
        let sql = `INSERT INTO ${postTable} (user, message) VALUES ("${user}", "${message}")`;
        await queryDB(sql);
        
        res.json({ message: "Post successful!" });

    } catch (err) {
        console.error("Error writing post:", err);
        res.status(500).json({ error: "Failed to write post" });
    }
});

// (Check Login) ตรวจสอบ username/password กับ database
app.post('/checkLogin', async (req,res) => {
    try {
        const { username, password } = req.body;
        
        // Select the user from the database
        let sql = `SELECT * FROM ${userTable} WHERE username = '${username}'`;
        let result = await queryDB(sql); // result is an array

        // 1. Check if user was found (result array is empty)
        if (result.length === 0) {
            console.log("Login fail: user not found");
            return res.redirect('login.html?error=1');
        }

        const foundUser = result[0]; // Get the user object from the array

        // 2. Check if password matches
        if (foundUser.password === password) {
            // Success! Set cookies
            console.log("Login success");
            res.cookie('username', foundUser.username);
            res.cookie('img', foundUser.img); // Store image path in cookie
            return res.redirect('feed.html');
        } else {
            // Password incorrect
            console.log("Login fail: wrong password");
            return res.redirect('login.html?error=1');
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.redirect('login.html?error=1');
    }
});


app.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/register.html`);
});