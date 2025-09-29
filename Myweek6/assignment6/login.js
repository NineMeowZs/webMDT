window.onload = loginLoad;

function loginLoad(){
    let form = document.getElementById("myLogin");
    form.onsubmit = checkLogin;

    // ดึง username และ password จาก URL parameter
    let params = new URLSearchParams(window.location.search);
    let newUser = params.get("username");
    let newPass = params.get("password");

    // autofill username และ password (จะได้ไม่ต้องพิมพ์ซ้ำ)
    if(newUser){
        document.getElementById("username").value = newUser;
    }
    if(newPass){
        document.getElementById("password").value = newPass;
    }
}

function checkLogin(){
    let form = document.forms["myLogin"];
    let username = form["username"].value.trim();
    let password = form["password"].value;

    // ดึงจาก URL parameter อีกครั้ง
    let params = new URLSearchParams(window.location.search);
    let regUser = params.get("username");
    let regPass = params.get("password");

    if(username === regUser && password === regPass){
        alert("Login เรียบร้อย ยินดีต้อนรับครับคุณ " + username);

        // ส่งไปหน้า home พร้อม username
        window.location.href = "home.html?username=" + encodeURIComponent(username);

        return false; 
    }else{
        alert("Username หรือ Password บ่ถูกต้อง");
        return false;
    }
}
