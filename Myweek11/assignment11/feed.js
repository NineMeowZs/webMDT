// js/feed.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. ตรวจสอบ Cookie และ Redirect
    const username = getCookie('username'); 
    if (!username) {
        window.location.href = 'index.html'; // ถ้าไม่มี cookie ให้ redirect ไปหน้า login
        return;
    }

    // แสดง username บนหน้า feed.html
    document.getElementById('username').textContent = username;

    // 2. ดึงข้อมูล Post และ User
    fetchData(username);

    // 3. Event Listener สำหรับ Post ข้อความ
    document.getElementById('postbutton').addEventListener('click', postMessage);

    // 4. Event Listener สำหรับ Profile Picture Upload
    const fileField = document.getElementById('fileField');
    fileField.addEventListener('change', () => {
        // เมื่อมีการเลือกไฟล์ใหม่ ให้ submit form อัปโหลดทันที
        document.getElementById('formId').submit(); 
    });

    // Event listener สำหรับการคลิกที่รูปโปรไฟล์เพื่อให้สามารถเลือกไฟล์ได้
    document.getElementById('displayPic').addEventListener('click', () => {
        fileField.click();
    });
});


// ฟังก์ชันช่วยในการอ่าน Cookie (Client-side)
function getCookie(name) {
    var value = null;
    try {
        // ค้นหา cookie ที่ชื่อตรงกันและดึงค่าออกมา
        const cookieString = document.cookie.split('; ').find(row => row.startsWith(name + '='));
        if (cookieString) {
            value = cookieString.split('=')[1];
        }
    } catch (err) {
        console.error('Error reading cookie:', err);
    }
    return value; // คืนค่า username หรือ null ถ้าหาไม่พบ
}

// ฟังก์ชันดึงข้อมูล user และ post
async function fetchData(currentUsername) {
    try {
        // ดึงข้อมูล User ทั้งหมดเพื่อหารูปโปรไฟล์ปัจจุบัน
        const userRes = await fetch('/js/userDB.json'); 
        const userData = await userRes.json();
        const currentUser = userData.find(u => u.username === currentUsername);

        if (currentUser && currentUser.profilepic) {
            // แสดงรูปโปรไฟล์ปัจจุบัน
            document.querySelector('#displayPic img').src = 'img/profile/' + currentUser.profilepic;
        }

        // ดึงข้อมูล Post ทั้งหมด
        const postRes = await fetch('/readPost'); // เรียกใช้ routing ที่ server.js
        const postData = await postRes.json();

        // แสดงผล Post
        displayPosts(postData);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// ฟังก์ชันแสดง Post บนหน้าเว็บ
async function displayPosts(posts) {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = ''; // เคลียร์โพสต์เก่า

    // ดึงข้อมูล User อีกครั้งเพื่อ mapping รูปโปรไฟล์กับ post
    const userRes = await fetch('/js/userDB.json'); 
    const userData = await userRes.json();
    const userMap = new Map(userData.map(user => [user.username, user.profilepic || 'avatar.png']));


    // เรียงลำดับ Post ล่าสุดอยู่บนสุด
    posts.reverse().forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post-item');

        const profilePic = userMap.get(post.username) || 'avatar.png'; // หารูปโปรไฟล์
        const picSource = profilePic === 'avatar.png' ? 'img/avatar.png' : 'img/profile/' + profilePic;
        
        // สร้าง HTML สำหรับแต่ละ Post
        postElement.innerHTML = `
            <div class="post-header">
                <img src="${picSource}" alt="Profile Picture" class="post-avatar">
                <strong>${post.username}</strong>
                <span class="post-timestamp">${new Date(post.timestamp).toLocaleString()}</span>
            </div>
            <p class="post-msg">${post.msg}</p>
            <hr>
        `;
        feedContainer.appendChild(postElement);
    });
}

// ฟังก์ชันส่ง Post ข้อความใหม่
async function postMessage() {
    const textmsg = document.getElementById('textmsg');
    const msg = textmsg.value.trim();

    if (msg.length === 0) {
        alert('กรุณาพิมพ์ข้อความ');
        return;
    }

    try {
        const response = await fetch('/writePost', { // เรียกใช้ routing ที่ server.js
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ msg: msg })
        });

        const result = await response.json();

        if (result.success) {
            textmsg.value = ''; // เคลียร์ textarea
            // ดึง Post ใหม่มาแสดงผล
            await fetchData(getCookie('username')); // อัปเดต feed
        } else {
            alert('เกิดข้อผิดพลาดในการโพสต์: ' + result.message);
        }
    } catch (error) {
        console.error('Error posting message:', error);
        alert('เกิดข้อผิดพลาดในการติดต่อ Server');
    }
}