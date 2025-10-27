const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // ใช้ promises
const app = express();
const hostname = 'localhost';
const port = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 🟢 อ่านจากไฟล์ log.json
app.get('/inmsg', async (req, res) => {
  try {
    const data = await readMsg();
    res.json(data);
  } catch (err) {
    console.error("❌ Error reading file:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 รับข้อความใหม่จาก user และบันทึก
app.post('/outmsg', async (req, res) => {
  try {
    const new_msg = req.body;
    const data1 = await readMsg();
    const updated = await updateMsg(new_msg, data1);
    await writeMsg(updated);
    res.json({ status: "ok" });
  } catch (err) {
    console.error("❌ Error writing file:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📘 อ่านไฟล์ JSON
const readMsg = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fs.readFile('log.json', 'utf-8');
      resolve(JSON.parse(data));
    } catch (err) {
      reject(err);
    }
  });
};

// ✏️ อัปเดตข้อความในไฟล์
const updateMsg = (new_msg, data1) => {
  return new Promise((resolve, reject) => {
    try {
      let keys = Object.keys(data1);
      let newKey = `msg${keys.length + 1}`;
      data1[newKey] = new_msg;
      resolve(data1);
    } catch (err) {
      reject(err);
    }
  });
};

// 💾 เขียนไฟล์กลับไปที่ log.json
const writeMsg = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.writeFile('log.json', JSON.stringify(data, null, 2));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
