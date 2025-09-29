window.onload = pageLoad;

function pageLoad(){
	// เมื่อโหลดเสร็จให้ผูกปุ่ม Start กับ startGame
	document.getElementById("start").onclick = startGame;
}

function startGame(){
	alert("Ready");
	addBox();
	timeStart();
}

function timeStart(){
	var TIMER_TICK = 1000;
	var timer = null;
	var min = 0.5; // 0.5 minute
	var second = min * 60; 
	var x = document.getElementById('clock');
	
	// ใช้ setInterval เพื่อทำงานทุกๆ 1 วินาที
	timer = setInterval(timeCount, TIMER_TICK);

	function timeCount(){
		var allbox = document.querySelectorAll("#layer div");
		second--;
		x.innerHTML = second;

		if(allbox.length == 0 && second > 0){
			alert("You Win!");
			clearInterval(timer);
			clearScreen();
		}
		else if(second <= 0){
			if(allbox.length > 0){
				alert("Game Over");
				clearInterval(timer);
				clearScreen();
			}
		}
	}
}

function addBox(){
	// รับค่าจำนวนกล่องและสีจาก input
	var numbox = document.getElementById("numbox").value;
	var gameLayer = document.getElementById("layer");
	var colorDrop = document.getElementById("color").value;

	for (var i = 0; i < numbox; i++){
		var tempbox = document.createElement("div");
		tempbox.className = "square";
		tempbox.id = "box" + i;
		tempbox.style.left = Math.random() * (500 - 25) + "px";
		tempbox
