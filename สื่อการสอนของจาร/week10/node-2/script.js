// AJAX, run on localhost (XAMPP)
// รันผ่าน localhost ตามดัวย path และ เรียก index.html
window.onload = pageLoad;
function pageLoad(){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "data_2.json",true); 
    xhr.onload = function() { 
        alert(xhr.responseText); 
    }; 
    xhr.onerror = function() { 
        alert("ERROR!"); 
    }; 
    xhr.send();
}

// Fetch, run on localhost (XAMPP)
const readLog = (() => {
	fetch("data_2.json").then((response) => {
        response.json().then((data) => {
            console.log(data);
        });
    }).catch((err) => {
        console.log(err);
    })
})

readLog();


