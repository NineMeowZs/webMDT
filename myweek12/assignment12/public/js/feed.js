// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
var username = "";
 if(getCookie("username")==false){ // [cite: 948]
 window.location = "login.html";
}
}

checkCookie();
window.onload = pageLoad;

function getCookie(name){
 var value = "";
 try{
  value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
  return value
 }catch(err){
  return false
 } 
}

function pageLoad(){
 document.getElementById('postbutton').onclick = getData;

 document.getElementById('displayPic').onclick = fileUpload;
 document.getElementById('fileField').onchange = fileSubmit;
 
 var username = getCookie('username');

 document.getElementById("username").innerHTML = username;
 console.log(getCookie('img'));
    // Show the profile picture from the cookie [cite: 956]
 showImg('img/'+getCookie('img'));
 readPost(); // Load posts when the page loads
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
 document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
 if (filename !==""){
  var showpic = document.getElementById('displayPic');
  showpic.innerHTML = "";
  var temp = document.createElement("img");
  temp.src = filename;
  showpic.appendChild(temp);
 }
}

// (Read Post) อ่าน post จาก server
async function readPost(){
    try {
        // Fetch data from the /readPost route (similar to week12.pdf [cite: 908])
        const response = await fetch("/readPost"); 
        if(response.ok){
            const data = await response.json(); // [cite: 909]
            showPost(data); // Send data to be displayed [cite: 910]
        }
    } catch (err) {
        console.error("Error reading posts:", err);
    }
}

// (Write Post) ส่ง post ใหม่ไปที่ server
async function writePost(msg){
    var username = getCookie('username'); 

    // Create the message object to send
    let msgObject = {
        user: username,
        message: msg
    };

    try {
        // Use fetch with "POST" method
        let response = await fetch("/writePost", { 
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(msgObject)
        });
        
        if (response.ok) {
            // After posting, reload the feed to show the new post
            readPost(); 
        } else {
            console.error("Server responded with an error:", response.status);
        }

    } catch (err) {
        console.error("Error writing post:", err);
    }
}

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(data){
 var keys = Object.keys(data);
 var divTag = document.getElementById("feed-container");
 divTag.innerHTML = "";
 for (var i = keys.length-1; i >=0 ; i--) { // Loop backwards to show newest first

  var temp = document.createElement("div");
  temp.className = "newsfeed";
  divTag.appendChild(temp);
  var temp1 = document.createElement("div");
  temp1.className = "postmsg";
  temp1.innerHTML = data[keys[i]]["message"];
  temp.appendChild(temp1);
  var temp1 = document.createElement("div");
  temp1.className = "postuser";
  
  temp1.innerHTML = "Posted by: "+data[keys[i]]["user"];
  temp.appendChild(temp1);
  
 }
}