window.onload = pageLoad; 

function pageLoad(){
    let form = document.getElementById("myRegister");
    form.onsubmit = valitForm;
}

function valitForm() {
    let form = document.forms["myRegister"];
    let errormsg = document.getElementById("errormsg");

    let firstname = form["firstname"].value.trim();
    let lastname = form["lastname"].value.trim();
    let gender = form["gender"].value;
    let bday = form["bday"].value;
    let email = form["email"].value.trim();
    let username = form["username"].value.trim();
    let password = form["password"][0].value; 
    let repassword = form["password"][1].value; 

    // ตรวจสอบว่าข้อมูลครบทุกช่อง
    if(firstname === "" || lastname === "" || gender === "" || bday === "" || 
       email === "" || username === "" || password === "" || repassword === ""){
        errormsg.innerHTML = "กรอกข้อมูลให้ครบทุกช่องก่อนเด้อ";
        return false;
    }

    // ตรวจสอบ password ว่าตรงกัน
    if(password !== repassword){
        errormsg.innerHTML = "รหัสผ่านบ่ตรงกัน อ้ายมั่วบ่นิ";
        return false;
    }

    // ส่งไปหน้า login โดยส่ง username + password ผ่าน URL parameter
    window.location.href = "login.html?username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

    return false; 
}
