window.onload = loginLoad;

function loginLoad(){
    let form = document.getElementById("myLogin");
    form.onsubmit = checkLogin;
}

function checkLogin(){
    let form = document.forms["myLogin"];
    let username = form["username"].value.trim();
    let password = form["password"].value;

    if(newUser){
        document.getElementById("username").value = newUser;
    }
    if(newPass){
        document.getElementById("password").value = newPass;
    }
    
    // // ดึงจาก URL parameter อีกครั้ง
    let params = new URLSearchParams(window.location.search);
    let regUser = params.get("username");
    let regPass = params.get("password");

    if(username === regUser && password === regPass){
        alert("Login เรียบร้อย ยินดีต้อนรับครับคุณ " + username);

         // ส่งไปหน้าต่่อไป พร้อม Username
        // window.location.href = "home.html?username=" + encodeURIComponent(username);

        return false; 
    }else{
        alert("Username หรือ Password บ่ถูกต้อง");
        return false;
    }
}
