// ตัวอย่าง fetch 
// const sendMsg = (() => {
// 	fetch("/message").then((response) => {
//         response.text().then((data) => {
//             console.log(data);
//         });
//     }).catch((err) => {
//         console.log(err);
//     })
// })
// window.onload = sendMsg;

// POST method
const sendMsg = (msg) => {
	fetch("/message", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
			name: "John",
            age: 60
		  })
      }).then((response) => {
            response.json().then((data) => {
                        console.log(data);
                    });
      }).catch((err) => {
                console.log(err);
            });
};

window.onload = sendMsg;

// async await in fetch
// const sendMsg =  (async (msg) => {
//     let response = await fetch("/message", {
//         method: "POST",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: "John",
//             age: 60
//             })
//         });
//     let content = await response.json();
//     console.log(content);
// });

// window.onload = sendMsg;