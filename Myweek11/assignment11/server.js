// server.js (ASSIGNMENT 11 - JSON File Based)

const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000; 
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer'); // ต้องติดตั้ง: npm install multer
const path = require('path');

// 💡 1. กำหนดให้ Express ให้บริการไฟล์ Static จาก Root Directory
app.use(express.static(__dirname)); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser()); 

// 💡 2. Multer Setup: โฟลเดอร์ img/profile/
const uploadDir = 'img/profile/';
if (!fs.existsSync(uploadDir)) {
    // สร้างโฟลเดอร์ img/profile/ หากยังไม่มี
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadDir); // บันทึกใน img/profile/
    },
    filename: (req, file, cb) => {
        // ตั้งชื่อไฟล์ใหม่ให้ไม่ซ้ำ
        cb(null, 'avatar-' + req.cookies.username + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    // กรองเฉพาะไฟล์รูปภาพ
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

// ---------------------------------------------
// Helper Functions (อ่าน/เขียนไฟล์ JSON)
// ---------------------------------------------

const readJson = (file_name) => {
    try {
        const filePath = path.join(__dirname, file_name); 
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch(err) {
        console.error(`Error reading ${file_name}:`, err.message);
        return {}; 
    }
}

const writeJson = (data, file_name) => {
    try {
        const filePath = path.join(__dirname, file_name); 
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch(err) {
        console.error(`Error writing ${file_name}:`, err.message);
        return false;
    }
}

// 💡 3. อัปเดตชื่อไฟล์รูปภาพใน userDB.json
const updateImg = async (username, fileimg) => {
    let userData = readJson('userDB.json');
    // ค้นหา key ของ user ปัจจุบัน
    const userKey = Object.keys(userData).find(key => userData[key].username === username);

    if (userKey) {
        // อัพเดต field 'img' ใน userDB.json (ใช้ 'img' ตาม userDB.json เดิม)
        userData[userKey].img = fileimg; 
        return writeJson(userData, 'userDB.json');
    }
    return false;
}

// ---------------------------------------------
// Routing
// ---------------------------------------------

// POST /profilepic: Upload รูปและอัพเดต userDB.json
app.post('/profilepic', (req,res) => {
    const username = req.cookies.username;
    if (!username) {
        return res.redirect('/login.html');
    }

    upload(req, res, async (err) => { 
        if (req.fileValidationError || !req.file || err) {
            // หากเกิด Error จาก Multer (เช่น ไม่ใช่ไฟล์รูป)
            console.error("Upload Error:", req.fileValidationError || (err ? err.message : 'No file selected'));
            return res.redirect('/feed.html?error=upload'); 
        }
        
        const uploadedFilename = req.file.filename;

        // 1. อัพเดต userDB.json
        const dbUpdated = await updateImg(username, uploadedFilename);

        if (dbUpdated) {
            // 2. อัพเดต cookie 'img' ด้วยชื่อไฟล์ใหม่
            const maxAge = 24 * 60 * 60 * 1000;
            res.cookie('img', uploadedFilename, { maxAge: maxAge }); 
            
            // 3. Redirect กลับไป feed.html
            return res.redirect('/feed.html'); 
        } else {
             console.error("Failed to update user DB for profile pic.");
             return res.redirect('/feed.html?error=dbupdate');
        }
    });
})
// POST /checkLogin: ตรวจสอบ Login
app.post('/checkLogin', async (req,res) => {
    const { username, password } = req.body;
    const userData = readJson('userDB.json');

    const userKey = Object.keys(userData).find(key => 
        userData[key].username === username && userData[key].password === password
    );

    if (userKey) {
        const maxAge = 24 * 60 * 60 * 1000; 
        const user = userData[userKey];
        
        // Set cookies 
        res.cookie('username', username, { maxAge: maxAge }); 
        res.cookie('img', user.img || 'avatar.png', { maxAge: maxAge });
        
        return res.redirect('feed.html');
    } else {
        return res.redirect('index.html?error=1');
    }
})

// GET /logout: ลบ Cookie
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('index.html');
})

// GET /readPost: อ่าน PostDB.json
app.get('/readPost', async (req,res) => {
    const postData = readJson('postDB.json');
    return res.json(postData);
})

// POST /writePost: บันทึก Post
app.post('/writePost',async (req,res) => {
    const msg = req.body.msg; 
    const username = req.cookies.username; 
    
    if (!username || !msg) {
        return res.status(400).json({ success: false, message: 'Invalid data or not logged in.' });
    }

    let postData = readJson('postDB.json');
    const newPostId = 'post' + (Object.keys(postData).length + 1);
    const newPost = {
        user: username,
        message: msg,
        timestamp: new Date().toISOString()
    };
    postData[newPostId] = newPost; 

    if (writeJson(postData, 'postDB.json')) {
        return res.json({ success: true, message: 'Post successful.' });
    } else {
        return res.status(500).json({ success: false, message: 'Failed to save post.' });
    }
})

// POST /profilepic: Upload รูปและอัพเดต userDB.json
app.post('/profilepic', (req,res) => {
    const username = req.cookies.username;
    if (!username) {
        return res.redirect('/index.html');
    }

    upload(req, res, async (err) => { 
        if (req.fileValidationError || !req.file || err) {
            const errorMsg = req.fileValidationError || (err ? err.message : 'Please select an image to upload.');
            // Note: ใน Assignment นี้ สั่งให้ redirect เลย
            return res.redirect('/feed.html?error=upload'); 
        }
        
        const uploadedFilename = req.file.filename;

        // 1. อัพเดต userDB.json
        const dbUpdated = await updateImg(username, uploadedFilename);

        if (dbUpdated) {
            // 2. อัพเดต cookie
            const maxAge = 24 * 60 * 60 * 1000;
            res.cookie('img', uploadedFilename, { maxAge: maxAge }); 
            
            // 3. Redirect กลับไป feed.html
            return res.redirect('/feed.html'); 
        } else {
             return res.send('Upload success, but failed to update user profile in DB.');
        }
    });
})

// GET /: Redirect ไปหน้า Login
app.get('/', (req, res) => {
    res.redirect('/index.html'); 
});


// Start Server
 app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
});