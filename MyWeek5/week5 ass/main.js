// แสดง Welcome //
window.onload = function () {
    document.getElementById("top").innerText = "Welcome to the Forum";
};

let postCount = 0;

function postFunction() {
    const message = document.getElementById("message").value;

    if (message.trim() === "") {
        alert("พิมพ์ข้อความด้วยจ้า");
        return;
    }

    // นับการพิมพ์ของ User//
    postCount++;

    if (postCount === 1) {
        document.getElementById("topic").innerText = message;
    } else if (postCount === 2) {
        document.getElementById("reply1").innerText = message;
    } else if (postCount === 3) {
        document.getElementById("reply2").innerText = message;
    } else {
        alert("พื้นที่พิมพ์เต็มแล้วเด้อ กด Clear ก้อน");
    }
    document.getElementById("message").value = "";
}

function clearFunction() {
    document.getElementById("topic").innerText = "";
    document.getElementById("reply1").innerText = "";
    document.getElementById("reply2").innerText = "";
    document.getElementById("message").value = "";
    postCount = 0; 
    // รีเซ็ตใน ELement
}
