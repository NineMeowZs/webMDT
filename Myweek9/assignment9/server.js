const fs = require('fs').promises; // ใช้ promises version ของ fs
const http = require('http');

const hostname = 'localhost';
const port = 3000;

// ฟังก์ชันแก้ไข JSON
const editJsonFile = (data) => {
  const n_stock = {
    item1: 12,
    item2: 13,
    item3: 50,
    item4: 22,
    item5: 55,
    item6: 87,
    item7: 12,
    item8: 29,
    item9: 10,
  };

  const obj = JSON.parse(data);

  // เพิ่มจำนวนสินค้าเข้าไปในแต่ละ item
  for (let key in obj) {
    if (n_stock[key] !== undefined) {
      obj[key].stock = n_stock[key];
    }
  }

  return obj;
};

// ฟังก์ชันหลัก ใช้ Promise chain
const readAndWriteFile = () => {
  console.log("แก้ไขข้อมูลสักครู่");

  return fs.readFile('cloth1.json', 'utf-8')
    .then((data) => {
      const newData = editJsonFile(data);
      const jsonString = JSON.stringify(newData, null, 2);

      return fs.writeFile('new_cloth.json', jsonString)
        .then(() => newData);
    })
    .catch((err) => {
      console.error("Error:", err);
      throw err;
    });
};

// สร้าง server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  readAndWriteFile()
    .then((data) => {
      res.write("<h1>แก้ไขไฟล์ละ</h1>");
      res.write("<h2>ข้อมูลที่อัปเดตแล้ว :</h2>");
      res.write("<pre>" + JSON.stringify(data, null, 2) + "</pre>");
      res.end();
    })
    .catch((err) => {
      res.write("<h1>Error อะพี่ชาย :</h1>");
      res.write("<pre>" + err.message + "</pre>");
      res.end();
    });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`กรุณาเข้าถึง URL นี้ใน Browser: http://${hostname}:${port}/`);
});
