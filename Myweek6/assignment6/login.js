window.onload = loginLoad;

function loginLoad(){
    let form = document.getElementById("myLogin");
    form.onsubmit = checkLogin;
}

function checkLogin(){
    let form = document.forms["myLogin"];
    let username = form["username"].value.trim();
    let password = form["password"].value;

    // ดึงข้อมูล User/รหัส จาก localStorage
    let regUser = localStorage.getItem("username");
    let regPass = localStorage.getItem("password");

    if(username === regUser && password === regPass){
        alert("Login เรียบร้อย ยินดีต้อนรับครับ คุณชาย/คุณนาย " + username);
        return true; // login ผ่าน
    }else{
        alert("Username หรือ Password บ่ถูกต้อง");
        return false;
    }
}
