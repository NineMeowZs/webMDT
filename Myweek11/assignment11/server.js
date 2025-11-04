const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser'); // Import cookie-parser
const multer = require('multer');
const path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser()); // Use cookie-parser

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/'); 
    },

    filename: (req, file, cb) => {
        // ใช้ username ที่เก็บใน cookie มาตั้งชื่อไฟล์เพื่อให้ไม่ซ้ำและอ้างอิงง่าย
        // req.cookies.username จะใช้ได้หลังจาก checkLogin สำเร็จ
        const username = req.cookies.username || 'default';
        cb(null, username + path.extname(file.originalname)); 
    }
  });

  const imageFilter = (req, file, cb) => { // นี่คือการประกาศตัวแปร imageFilter
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

  const upload = multer({ 
    storage: storage, 
    fileFilter: imageFilter,
    // กำหนด single('avatar') ที่นี่เพื่อให้ใช้ได้ใน /profilepic
  }).single('avatar'); 



app.post('/profilepic', (req,res) => {
    // ใช้ upload middleware ที่กำหนดไว้ด้านบน
    upload(req, res, async (err) => {
        if (req.fileValidationError) {
            console.log(req.fileValidationError);
            return res.redirect('/feed.html'); 
        } else if (!req.file) {
            console.log('Please select an image to upload');
            return res.redirect('/feed.html');
        } else if (err instanceof multer.MulterError) {
            console.log(err);
            return res.redirect('/feed.html');
        } else if (err) {
            console.log(err);
            return res.redirect('/feed.html');
        }

        // หากอัปโหลดสำเร็จ
        const username = req.cookies.username;
        const filename = req.file.filename;

        // อัปเดต userDB.json ด้วยชื่อไฟล์ใหม่
        await updateImg(username, filename);
        
        return res.redirect('/feed.html'); // redirect กลับไปหน้า feed.html
    });
 });


// ถ้าต้องการจะลบ cookie ให้ใช้
// res.clearCookie('username');
app.get('/logout', (req,res) => {
    res.clearCookie('username'); // ลบคุ้กกี้ 'username'
    return res.redirect('index.html');
})


app.get('/readPost', async (req,res) => {
    const postData = await readJson('js/postDB.json');
    // ส่งข้อมูล Post ทั้งหมดกลับไปให้ client
    res.json(postData); 
})


app.post('/writePost',async (req,res) => {
    const { msg } = req.body;
    const username = req.cookies.username;

    if (!username || !msg) {
        return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const postData = await readJson('js/postDB.json');
    
    // สร้าง post object ใหม่
    const newPost = {
        username: username,
        msg: msg,
        timestamp: new Date().toISOString()
    };
    
    // เพิ่ม post ใหม่เข้าไปใน array
    postData.push(newPost);

    // เขียน array ที่อัปเดตแล้วกลับไปที่ไฟล์
    await writeJson(postData, 'js/postDB.json');

    res.json({ success: true, post: newPost });
})


app.post('/checkLogin',async (req,res) => {
    const { username, password } = req.body;
    const userData = await readJson('js/userDB.json');

    // ตรวจสอบ username และ password ใน userData
    const user = userData.find(u => u.username === username && u.password === password);

    if (user) {
        // ถ้าเช็คแล้ว username และ password ถูกต้อง
        res.cookie('username', username, { maxAge: 3600000, httpOnly: true, path: '/' }); // ตั้งค่า cookie
        return res.redirect('feed.html');
    } else {
        // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
        return res.redirect('index.html?error=1')
    }
})


const readJson = async (file_name) => {
    try {
        const data = await fs.promises.readFile(file_name, 'utf8'); // อ่านไฟล์
        return JSON.parse(data); // แปลงเป็น object/array
    } catch (err) {
        console.error(`Error reading ${file_name}:`, err);
        return []; // คืนค่าเป็น array เปล่าหากเกิดข้อผิดพลาดในการอ่าน
    }
}


const writeJson = async (data, file_name) => {
    try {
        const jsonString = JSON.stringify(data, null, 4); // แปลงเป็น JSON string (pretty print)
        await fs.promises.writeFile(file_name, jsonString, 'utf8'); // เขียนไฟล์
    } catch (err) {
        console.error(`Error writing ${file_name}:`, err);
    }
}


const updateImg = async (username, fileimg) => {
    const userData = await readJson('js/userDB.json');
    const userIndex = userData.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        // อัปเดตชื่อไฟล์รูปโปรไฟล์
        userData[userIndex].profilepic = fileimg; // แก้ไขข้อมูลใน userDB.json
        await writeJson(userData, 'js/userDB.json');
    }
}

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});