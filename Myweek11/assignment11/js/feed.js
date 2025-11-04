// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ index.html
function checkCookie(){
    var username = getCookie("username");
    // ตรวจสอบ cookie username [cite: 273]
    if(!username){
        window.location = "index.html"; 
    }
    return username;
}

const currentUsername = checkCookie(); // เก็บ username ที่อ่านได้
window.onload = pageLoad;

function getCookie(name){
    var value = "";
    try{
        // แก้ไขให้รองรับการค้นหา cookie ที่มี space
        const cookieString = document.cookie.split("; ").find(row => row.startsWith(name + '='));
        if (cookieString) {
            value = cookieString.split('=')[1];
            return value;
        }
        return false;
    }catch(err){
        return false
    } 
}

function pageLoad(){
    document.getElementById('postbutton').onclick = getData;

    document.getElementById('displayPic').onclick = fileUpload;
    document.getElementById('fileField').onchange = fileSubmit;
    
    // แสดง username 
    document.getElementById("username").innerHTML = currentUsername;

    // แสดงรูป Profile Picture ที่เรา Upload ลงไป 
    loadUserProfileAndPosts();
}

// โหลดข้อมูล User และ Post
async function loadUserProfileAndPosts() {
    // 1. โหลดข้อมูล User เพื่อหารูปโปรไฟล์
    try {
        const userRes = await fetch('/js/userDB.json'); 
        const userData = await userRes.json();
        const currentUser = userData.find(u => u.username === currentUsername);
        
        // ตรวจสอบว่ามี field profilepic หรือไม่
        if (currentUser && currentUser.profilepic) {
            // โหลดรูปโปรไฟล์จาก img/profile/filename
            showImg('img/profile/' + currentUser.profilepic);
        } else {
            // ใช้รูป avatar.png เป็น default
            showImg('img/avatar.png');
        }
    } catch(err) {
        console.error('Failed to load user data:', err);
        showImg('img/avatar.png');
    }
    
    // 2. อ่าน Post 
    readPost();
}


function getData(){
    var msg = document.getElementById("textmsg").value;
    document.getElementById("textmsg").value = "";
    writePost(msg);
}

function fileUpload(){
    document.getElementById('fileField').click();
}

function fileSubmit(){
    // เมื่อมีการเลือกไฟล์ จะ submit form อัตโนมัติไปยัง /profilepic ใน server.js
    document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
    if (filename !==""){
        var showpic = document.getElementById('displayPic');
        showpic.innerHTML = "";
        var temp = document.createElement("img");
        temp.src = filename;
        temp.alt = "Profile Picture";
        showpic.appendChild(temp);
    }
}

// อ่าน post จาก file
async function readPost(){
    try {
        // เรียกใช้ API จาก server.js เพื่ออ่าน postDB.json
        const response = await fetch('/readPost');
        const data = await response.json();
        
        // ส่งข้อมูลที่อ่านได้ไปแสดงผล
        showPost(data);
    } catch(err) {
        console.error("Error reading posts:", err);
    }
}

// เขียน post ใหม่ ลงไปใน file
async function writePost(msg){
    if (msg.trim() === "") return;
    
    try {
        // เรียกใช้ API จาก server.js เพื่อเขียน postDB.json 
        const response = await fetch('/writePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ msg: msg })
        });

        const result = await response.json();

        if (result.success) {
            // เมื่อ post สำเร็จ ให้ reload feed ใหม่
            readPost(); 
        } else {
            alert('Post failed: ' + result.message);
        }
    } catch(err) {
        console.error("Error writing post:", err);
        alert('An error occurred while posting.');
    }
}

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
async function showPost(posts) {
    const divTag = document.getElementById("feed-container");
    divTag.innerHTML = "";
    
    // โหลดข้อมูล User ทั้งหมดเพื่อใช้รูปโปรไฟล์
    const userRes = await fetch('/js/userDB.json'); 
    const userData = await userRes.json();
    const userMap = new Map(userData.map(user => [user.username, user.profilepic || 'avatar.png']));

    // เรียงลำดับ Post ล่าสุดอยู่บนสุด 
    posts.reverse().forEach(post => {
        const postElement = document.createElement("div");
        postElement.className = "newsfeed";
        
        // หารูปโปรไฟล์ของผู้ใช้ที่ post
        const profilePic = userMap.get(post.username) || 'avatar.png';
        const picSource = profilePic === 'avatar.png' ? 'img/avatar.png' : 'img/profile/' + profilePic;

        // สร้าง HTML สำหรับ Post
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${picSource}" alt="Profile Picture" class="post-avatar" style="width: 40px; heightc: 40px; border-radius: 50%; margin-right: 10px; object-fit: cover;">
                <strong>${post.username}</strong>
                <span class="post-timestamp" style="font-size: 0.8em; color: #888;">${new Date(post.timestamp).toLocaleString()}</span>
            </div>
            <div class="postmsg" style="padding: 10px 0;">${post.msg}</div>
            <hr style="border: 0; height: 1px; background: #eee;">
        `;
        
        divTag.appendChild(postElement);
    });
}