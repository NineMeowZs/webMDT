const http = require('http');
const fs = require('fs');

const hostname = 'localhost';
const port = 3000;
const server = http.createServer((req, res) => {
    
    //อ่านไฟล์ก่อนจึงอีดีท แล้วทำไรท์ไฟล์เพิ่ม และจึงแสดงผล
        readFile()
        .then(data => {
            return editJsonData(data);
        })
        .then(data => {
            return writeFile(data);
        })
        .then(finalData => {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(finalData, null, 2));
        })
        .catch(err => {
            console.error("มี Error เกิดขึ้้น :", err); 
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end("Server Error : " + err);
        });

});
//อ่านไฟล์
let readFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('cloth1.json', 'utf8', (err, data) => {
            if (err) {
                reject("อ่านไฟล์ cloth1.json ไม่ได้");
            } else {
                resolve(JSON.parse(data)); 
            }
        });
    });
};

//ใช้ Promise เติมข้อมูล item
let editJsonData = (clothesData) => {
    return new Promise((resolve, reject) => {
        const stockInfo = 
        {
            item1: 12, 
            item2: 13, 
            item3: 50, 
            item4: 22, 
            item5: 55,
            item6: 87, 
            item7: 12, 
            item8: 29, 
            item9: 10
        };
        //ทุก ๆ คีย์ไอเทมแต่ละตัวไล่ไป ให้เติม stock item ไปในข้อมูลนั้นด้วย 
        for (const key in clothesData) {
            if (stockInfo[key]) {
                clothesData[key].stock = stockInfo[key];
            }
        }
        resolve(clothesData); 
    });
};

//เขียนไฟล์เพิ่มแบบมีข้อมูล Stock แล้ว
let writeFile = (modifiedData) => {
    return new Promise((resolve, reject) => {
        const jsonString = JSON.stringify(modifiedData, null, 2);
        fs.writeFile('new_cloth.json', jsonString, (err) => {
            if (err) {
                reject("ไม่สามารถเขียนไฟล์ new.cloth.json ได้");
            } else {
                resolve(modifiedData); 
            }
        });
    });
};


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});    