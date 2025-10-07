const fs = require('fs');
const http = require('http');

const hostname = 'localhost';
const port = 3000;


const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    
  });

let readFileFun = () => {
    
}

// จำนวนเสื้อผ้าตามที่กำหนด
let editJsonFile = (data) => { 
    const n_stock = {
        item1: 12,
        item2: 13,
        item3: 50,
        item4: 22,
        item5: 55,
        item6: 87,
        item7: 12,
        item8: 29,
        item9: 10
    }

}

let writeFileFun = () =>{
    
}

server.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
});