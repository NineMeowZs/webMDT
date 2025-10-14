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
	// สร้าง JS object ที่เก็บข้อมูลของข้อความ
	// และเวลาที่ส่งข้อความ ให้ทำตาม format ดังนี้
	
	// body: JSON.stringify({
	// 	time: d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
	// 	user:username,
	// 	message:msg});
	
});

//ทำให้สมบูรณ์
const readLog = (async () => {
	
})

// รับ msg ที่เป็น JS object ที่อ่านมาได้จาก file
function postMsg(msg){
	var x = document.getElementById("chatbox");
	while(x.firstChild){
		x.removeChild(x.lastChild);
	}
	// ใช้ for loop ในการวนลูปเพื่อสร้าง element และแสดงข้อความที่อ่านมา
	let keys = Object.keys(msg);
	for (var i of keys){
		var div_d = document.createElement("div");
		div_d.className = "message";
		var timemsg = document.createTextNode("("+ msg[i].time+") ");
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
