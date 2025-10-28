// const express = require('express');
// const app = express();
// const hostname = 'localhost';
// const port = 3000;
// const bodyParser = require('body-parser');

// app.use(express.static(__dirname));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

//  app.post('/showname', (req,res) => {
//         console.log(req.body.name);
//         res.end("your name is:" + req.body.name);
//  })
 
//  app.listen(port, hostname, () => {
//     console.log(`Server running at   http://${hostname}:${port}/`);
// });

// cookies
// const express = require('express');
// const app = express();
// const hostname = 'localhost';
// const port = 3000;

// app.use(express.static(__dirname));
// var cookieParser = require('cookie-parser');
// app.use(cookieParser());

// app.get('/cookies', (req, res) => {
//     res.cookie('name', 'keroro'); 
//     res.cookie('name', 'keroro',{maxAge: 10000},'path=/');
//     res.cookie('img','1234.jpg')
//     res.end("cookies set");
// });

//  app.listen(port, hostname, () => {
//     console.log(`Server running at   http://${hostname}:${port}/`);
// });

// upload image file
const express = require('express');
const app = express();
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    //file.fieldname แทน file.originalname ก็ได้
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

app.post('/uppic', (req,res) => {
    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('avatar');

    upload(req, res, (err) => {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        res.send('You uploaded this image filename: '+ req.file.filename);
    });
 })
 
app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});