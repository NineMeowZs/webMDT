// feed.js

// ** Global Variables **
const currentUsername = checkCookie(); 
window.onload = pageLoad;

// ---------------------------------------------
// ## 1. 🍪 การจัดการ Cookie
// ---------------------------------------------

function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		// 💡 Redirect ไปที่ index.html (หน้า Login) หากไม่มี Cookie
		window.location.href = "index.html";
        return null; // ต้อง return null เมื่อ redirect
	}
    return getCookie('username');
}

function getCookie(name){
	var value = "";
	try{
		// 💡 ใช้ try-catch เพื่อจัดการกับกรณีที่ Cookie ไม่มีค่า
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

// ---------------------------------------------
// ## 2. 🖥️ การเริ่มต้นหน้าและแสดงผล
// ---------------------------------------------

function pageLoad(){
	document.getElementById('postbutton').onclick = getData;

	document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	
	// แสดง Username ที่ Login เข้ามา
	document.getElementById("username").innerHTML = currentUsername;

	// 💡 แสดงรูป Profile Picture โดยอ่านจาก Cookie 'img' ที่ตั้งจาก Server
	const imgCookie = getCookie('img') || 'avatar.png'; 
    let picPath;

    if (imgCookie === 'avatar.png') {
        picPath = 'img/avatar.png'; 
    } else {
        // รูปที่อัปโหลดจะถูกเก็บใน img/profile/filename
        picPath = 'img/profile/' + imgCookie; 
    }

	showImg(picPath);
    
	readPost(); // โหลด Post ล่าสุด
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
	if (filename !== ""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}

// ---------------------------------------------
// ## 3. 📤 การจัดการ Post และ API Call
// ---------------------------------------------

function getData(){
	var msg = document.getElementById("textmsg").value;
	// 💡 ไม่ควรเคลียร์ input ก่อนเขียน post สำเร็จ
	writePost(msg);
	document.getElementById("textmsg").value = ""; 
}

// อ่าน post จาก file ผ่าน API /readPost
async function readPost(){
    try {
        // Fetch Post Data จาก server.js
        const response = await fetch('/readPost');
        const postData = await response.json(); // postData เป็น Object ที่มี post1, post2, ...
        
        // เราต้อง fetch userDB.json ด้วยเพื่อดึงรูปโปรไฟล์ของทุกคนมาแสดงใน Post
        const userRes = await fetch('userDB.json'); 
        const userData = await userRes.json();
        
        showPost(postData, userData);
    } catch(err) {
        console.error("Error reading posts:", err);
    }
}

// เขียน post ใหม่ ลงไปใน file ผ่าน API /writePost
async function writePost(msg){
    if (msg.trim() === "") return;
    
    try {
        const response = await fetch('/writePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ msg: msg })
        });

        const result = await response.json();

        if (result.success) {
            readPost(); // Post สำเร็จ: โหลด Feed ใหม่
        } else {
            alert('Post failed: ' + result.message);
        }
    } catch(err) {
        console.error("Error writing post:", err);
        alert('An error occurred while posting.');
    }
}


// ---------------------------------------------
// ## 4. 🖼️ การแสดง Feed
// ---------------------------------------------

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(posts, userData){
	var keys = Object.keys(posts);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
    
    // สร้าง Map สำหรับค้นหารูปโปรไฟล์ของ User แต่ละคน
    const userMap = new Map();
    Object.values(userData).forEach(user => {
        userMap.set(user.username, user.img || 'avatar.png'); 
    });

	// เรียงลำดับจากล่าสุดไปเก่า (จาก keys.length-1 ไป 0)
	for (var i = keys.length-1; i >=0 ; i--) {
        var post = posts[keys[i]];
        
        const profilePicName = userMap.get(post.user) || 'avatar.png';
        const picSource = (profilePicName === 'avatar.png') 
                          ? 'img/avatar.png' 
                          : 'img/profile/' + profilePicName;

		var temp = document.createElement("div");
		temp.className = "newsfeed";
        
        // 💡 เพิ่ม Header ที่มีรูปโปรไฟล์และ Username
        var headerDiv = document.createElement("div");
        headerDiv.className = "post-header";
        headerDiv.innerHTML = `
            <img src="${picSource}" alt="Profile Picture" class="post-avatar" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover;">
            <strong>${post.user}</strong>
            <span class="post-timestamp" style="font-size: 0.8em; color: #888;">${post.timestamp ? new Date(post.timestamp).toLocaleString() : ''}</span>
        `;
        temp.appendChild(headerDiv);

		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = post["message"];
		temp.appendChild(temp1);
		
		divTag.appendChild(temp); // ใช้ appendChild หรือ prepend ก็ได้ ขึ้นอยู่กับการจัดเรียง CSS
	}
}


// ---------------------------------------------
// ## 5. 🖼️ การ Upload รูปโปรไฟล์
// ---------------------------------------------

// Trigger ให้กดปุ่ม input type="file" เมื่อคลิกที่รูป
function fileUpload(){
	document.getElementById('fileField').click();
}

// Submit form ทันทีที่เลือกไฟล์เสร็จสิ้น
function fileSubmit(){
	// 💡 Submit form ไปที่ /profilepic ใน server.js
	document.getElementById('formId').submit(); 
}

// ---------------------------------------------
// ** End of feed.js **
// ---------------------------------------------