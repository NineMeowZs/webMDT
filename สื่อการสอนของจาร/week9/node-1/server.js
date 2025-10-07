// console.log('i am first');

// setTimeout(() => {
//   console.log('i am second');
// }, 0);

// console.log('i am third');

// arrow function
// function hello(){
//     console.log("Hello");
// }
// hello()

// hello = () => {
//     console.log("Hello");
// }
// hello()

// hello = (message) => {
//     console.log("Hello "+message);
// }
// hello("Kejkaew")

//Hello world
// const http = require('http');
// const hostname = 'localhost';
// const port = 3000;
// const server = http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write("Hello world");
//     res.end();
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at   http://${hostname}:${port}/`);
// });

// file system
// const fs=require('fs');
// fs.readFile('test.txt', (err, data) => {
// 	if (err) 
// 		throw err;
		
// 	console.log("Content :  " + data);
// });

// const fs =  require('fs');
// const content= "this is the content in the file";
// fs.writeFile('message.txt', content , (err) => {
// 	if (err) 
// 		throw err;
// 	console.log('saved!');
// });

// const fs = require('fs');
// new_data = "This data will be appended at the end of the file.";
// fs.appendFile('message.txt', new_data , (err) => {
// 	if(err) 
// 		throw err;
// 	console.log('The new_content was appended successfully');
// });

// const fs = require('fs');
// const filename = 'message.txt';
// fs.unlink(filename, (err) => {
// 	if (err) 
// 		throw err;
// 	console.log('File deleted successfully');
// });

const fs = require('fs');
const path = './test1.txt';
fs.access(path, fs.F_OK, (err) => {
  if (err) {
    console.log("File not found");
    return;
  }else{
      console.log("Exist!");
  }
});

// Promises
// const fs=require('fs');
// fs.readFile('test.txt', (err, data) => {
// 	if (err) 
// 		throw err;
// 	else{
//         fs.writeFile('message.txt', data , (err) => {
//             if (err) 
//                 throw err;
//             console.log('saved!');
//         });
//     }
// });

// const fs = require('fs');
// const readData = () => {
//     return new Promise((resolve,reject) => {
//         fs.readFile('test.txt', (err, data) => {
//             if (err) 
//                 reject(err);
//             else
//                 resolve(data);
//         });
//     })
// }

// const writeData = (data) => {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('message.txt', data , (err) => {
//             if (err) 
//                 reject(err);
//             else
//                 resolve("saved!")
//         });
//     })
// }

// readData().then(writeData).then((out) => console.log(out));

// read and write json file
// const fs = require('fs');
// const readData = () => {
//     return new Promise((resolve,reject) => {
//         fs.readFile('jfile.json','utf8', (err, data) => {
//             if (err) 
//                 reject(err);
//             else
//             {
//                 console.log(data);
//                 resolve(data);
//             }
                
//         });
//     })
// }

// const writeData = (data) => {
//     return new Promise((resolve, reject) => {
//         fs.writeFile('new_jfile.json', data , (err) => {
//             if (err) 
//                 reject(err);
//             else
//                 resolve("saved!")
//         });
//     })
// }

// readData().then(writeData).then((out) => console.log(out));