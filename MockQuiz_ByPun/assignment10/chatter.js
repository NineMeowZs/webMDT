window.onload = pageLoad;
var username= "";
var timer = null;


function pageLoad(){
    var x = document.getElementById("submitmsg");
    x.onclick = sendMsg;
    var x = document.getElementById("clickok")
    x.onclick = setUsername;
}

function setUsername(){
    var x = document.getElementById("userInput");
     username = x.value;
    var x = document.getElementById("username");
    x.innerHTML = username;
    timer = setInterval (loadLog, 3000);//Reload file every 3000 ms
    document.getElementById("submitmsg").disabled = false;
    document.getElementById("clickok").disabled = true;
    readLog();
}

function loadLog(){
    readLog();
}

function sendMsg(){
    //get msg
    var text = document.getElementById("userMsg").value;
    document.getElementById("userMsg").value = "";
    writeLog(text);
}

//ทำให้สมบูรณ์
const writeLog = (async (msg) => {
    let d = new Date();
    // This part creates the message object as specified
    let msgObject = {
        time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
        user: username,
        message: msg
    };

    // Based on fetch POST example [cite: 462-493] and async/await example [cite: 706-736]
    try {
        let response = await fetch("/outmsg", { // Use /outmsg endpoint from server.js
            method: "POST", //
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' //
            },
            body: JSON.stringify(msgObject) //
        });
        
        // After sending, we immediately reload the log to show the new message
        if (response.ok) {
            let data = await response.json();
            postMsg(data); // Update chatbox with the latest log from server
        }

    } catch (err) {
        console.error("Error writing log:", err);
    }
});

//ทำให้สมบูรณ์
const readLog = (async () => {
    // Based on fetch GET example [cite: 371-383] and async/await example [cite: 706-736]
    try {
        let response = await fetch("/inmsg"); // Use /inmsg endpoint from server.js
        if(response.ok){
            let data = await response.json(); //
            postMsg(data); // Send the retrieved log (array) to postMsg
        }
    } catch (err) {
        // This might happen if log.json is empty or doesn't exist yet
        console.log("Error reading log, maybe it's empty:", err);
        postMsg([]); // Send an empty array to clear the chatbox
    }
})

// รับ msg ที่เป็น JS object ที่อ่านมาได้จาก file
// This function receives an array of message objects, e.g.,
// [ {"time":"10:30 AM", "user":"A", "message":"Hi"}, ... ]
function postMsg(msg){
    var x = document.getElementById("chatbox");
    while(x.firstChild){
        x.removeChild(x.lastChild);
    }
    // ใช้ for loop ในการวนลูปเพื่อสร้าง element และแสดงข้อความที่อ่านมา
    // msg is an array, so Object.keys(msg) will be ["0", "1", "2", ...]
    let keys = Object.keys(msg);
    for (var i of keys){ // i will be "0", "1", "2", ...
        var div_d = document.createElement("div");
        div_d.className = "message";
        var timemsg = document.createTextNode("("+ msg[i].time+") "); // msg[i] accesses the object at that index
        var boldmsg = document.createElement("b");
        boldmsg.innerHTML = msg[i].user;
        var textmsg = document.createTextNode(": "+msg[i].message);
        
        div_d.append(timemsg,boldmsg,textmsg);
        div_d.appendChild(document.createElement("br"));
        x.appendChild(div_d);
    }
    checkScroll();
}


function checkScroll(){
    var chatbox = document.getElementById('chatbox');
    var scroll = chatbox.scrollTop+chatbox.clientHeight === chatbox.scrollHeight;
    if (!scroll) {
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}