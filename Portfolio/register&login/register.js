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
    let retypepassword = form["password"][1].value; 

    // ตรวจสอบว่าข้อมูลครบทุกช่องมั้ย
    if(firstname === "" || lastname === "" || gender === "" || bday === "" || 
       email === "" || username === "" || password === "" || retypepassword === ""){
        errormsg.innerHTML = "กรอกข้อมูลให้ครบทุกช่องก่อนเด้อ";
        return false;
    }

    // ตรวจสอบ password ว่าตรงกัน
    if(password !== retypepassword){
        errormsg.innerHTML = "รหัสผ่านบ่ตรงกัน อ้ายมั่วบ่นิ";
        return false;
    }

    // // URL แบบสั้นๆ
    // window.location.href = "login.html?firstname=" + encodeURIComponent(firstname) + "&lastname=" + encodeURIComponent(lastname) + "&username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

    return true; 
}
