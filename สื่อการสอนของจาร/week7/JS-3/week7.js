// Timer
window.onload = pageLoad; 
function pageLoad() {
	document.getElementById("clickme").onclick= delayedMessage;
}

function delayedMessage() {
	document.getElementById("output").innerHTML= "Wait for it...";
	setTimeout(sayHello, 5000);
}

function sayHello() { // called when the timer goes off
	document.getElementById("output").innerHTML= "Hello!";
}

window.onload = pageLoad; 
var timer = null; // stores ID of interval timer

// function pageLoad() {
// 	document.getElementById("clickme").onclick= delayMsg2;
// }

// function delayMsg2() {
// 	if (timer === null) {
// 		timer = setInterval(showMDT, 1000);
// 	} else {
// 		clearInterval(timer);
// 		timer = null;
// 	}
// }
// function showMDT() { // called each time the timer goes off
// 	document.getElementById("output").innerHTML += " MDT!";
// }

//timer and parameters
window.onload = pageLoad; 

function pageLoad() {
	document.getElementById("clickme").onclick= delayedMultiply;
}

function delayedMultiply() {
	// 6 and 7 are passed to multiply when timer goes off
	setTimeout(multiply, 2000, 6, 7);
}
function multiply(a, b) {
	alert(a * b);
}

// add new node (ไม่ควรทำ)
window.onload = pageLoad; 
function pageLoad() {
	addParagraph();
}
// function addParagraph() {
// 	document.getElementById("main").innerHTML += "<p style='color: red; margin-left: 50px';> A paragraph!</p>";
// }

function addParagraph(){
	var p = document.createElement("p");
	p.innerHTML= "A paragraph!";
	document.getElementById("main").appendChild(p);
	document.getElementById("main").style.color = "red";
	document.getElementById("main").style.marginLeft = "50px";
}

// Selecting groups of DOM objects
// window.onload = pageLoad;
// function pageLoad(){
// 	// var addrParas = document.querySelectorAll("p");
// 	var addrParas = document.querySelectorAll("#address p");
// 	for (var i= 0; i< addrParas.length; i++) {
// 		addrParas[i].style.backgroundColor= "yellow";
// 	}
// }

// CSS classes
function addParagraph(){
	var p = document.createElement("p");
	p.innerHTML= "A paragraph!";
	document.getElementById("main").appendChild(p);
	document.getElementById("main").style.color = "red";
	document.getElementById("main").style.marginLeft = "50px";
}

window.onload = pageLoad; 

function pageLoad() {
	addParagraph();
	var x = document.getElementById("clickme");
	x.onclick = highlightField;
}

function highlightField(){
	var text = document.getElementById("main");
	text.classList.toggle("highlight")
}

//หรือทำแบบนี้ได้เช่นกัน เปลี่ยนแค่ฟังก์ชันเดียว
function highlightField(){
	var text = document.getElementById("main");
	if (!text.className){
		text.className = "highlight";
	}else if (!text.classList.contains("invalid")){
		text.classList.add("highlight2");
		// text.className = "";
	}
}

// removing a node
window.onload = pageLoad; 

function pageLoad() {
	var x = document.getElementById("clickme2");
	x.onclick = removeMe;
}
function removeMe(){
	var x = document.getElementById("removeMe");
	x.parentNode.removeChild(x);
}

function removeMe(){
	var x = document.getElementById("removeMe");
	if (document.body.contains(x)){
		x.parentNode.removeChild(x);
	}else{
		var h2 = document.createElement("h2");
		h2.innerHTML= "Hello World,";
		h2.id = "removeMe";
		document.getElementById("main2").appendChild(h2);
	}
}

// event object
window.onload= pageLoad;

function pageLoad() {
	var target = document.getElementById("target");
	target.onmousemove= target.onmousedown= showCoords;
};
function showCoords(event) {
	document.getElementById("target").innerHTML =
	"screen : (" + event.screenX+ ", " + event.screenY+ ")\n"+ 
	"client : (" + event.clientX+ ", " + event.clientY+ ")\n" + 
	"button : " + event.button;
}

