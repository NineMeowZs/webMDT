var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var hostname = 'localhost';
var port = 3000;
var fs = require('fs');

app.use(express.static(__dirname)); // [cite: 409, 426]
app.use(bodyParser.json()); // [cite: 521, 541]
app.use(bodyParser.urlencoded({extended: false})) // [cite: 529, 542]


// read from file to user
app.get('/inmsg', async (req, res) => { // [cite: 691]
  try {
    let data_string = await readMsg(); // [cite: 693]
    let data_obj = JSON.parse(data_string);
    res.json(data_obj); // 
  } catch (err) {
    // If file is empty or doesn't exist, send an empty array
    res.json([]);
  }
})

//from user, write data to file
app.post('/outmsg', async (req, res) => { // [cite: 691]
  try { // <-- เพิ่ม try ตรงนี้
    let new_msg = req.body; // [cite: 544, 553]
    
    let old_log_string;
    try {
        old_log_string = await readMsg(); // [cite: 693]
    } catch (err) {
        // If file doesn't exist or is empty, start with an empty array string
        old_log_string = "[]";
    }

    let new_log_string = await updateMsg(new_msg, old_log_string);
    await writeMsg(new_log_string); // [cite: 696]
    res.json(JSON.parse(new_log_string));
  } catch (err) { // <-- เพิ่ม catch ตรงนี้
    console.error("Error in /outmsg handler:", err);
    res.status(500).json({ error: "Server failed to process message" });
  }
})

// read json data from file
const readMsg = () => {
  return new Promise((resolve,reject) => {
    // Based on readData example [cite: 639-664]
    fs.readFile('log.json', 'utf8', (err, data) => { // [cite: 643]
        if(err) { // [cite: 646]
            reject(err); // [cite: 648]
        }
        else {
        // If data is empty string (e.g., new file), send "[]"
        if(data === ""){
            resolve("[]");
        } else {
              resolve(data); // [cite: 656]
        }
        }
    });
  })
} 

// update json data
const updateMsg = (new_msg, data1) => {
  return new Promise((resolve,reject) => { 
    try {
        let logArray = JSON.parse(data1); 
        if (!Array.isArray(logArray)) {
            logArray = [];
        }
        logArray.push(new_msg);
        let newDataString = JSON.stringify(logArray); // [cite: 482]
        resolve(newDataString);
    } catch (err) {
        reject(err);
    }
  });
}

// write json data to file
const writeMsg = (data) => {
  return new Promise((resolve,reject) => {
    // Based on writeData example [cite: 666-684]
    fs.writeFile('log.json', data, (err) => { // [cite: 670]
        if(err){ // [cite: 673]
            reject(err); // [cite: 675]
        }
        else{
            resolve("saved!"); // [cite: 679]
        }
    });
})};

app.listen(port, hostname, () => { // [cite: 137, 443]
  console.log(`Server running at   http://${hostname}:${port}/`); // [cite: 139, 445]
});