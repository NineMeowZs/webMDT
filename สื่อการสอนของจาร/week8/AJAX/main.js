
window.onload = pageLoad;

function pageLoad(){
    var xhr = new XMLHttpRequest(); 
    xhr.open("GET", "data.txt"); 
    xhr.onload = function() { 
        alert(xhr.responseText); 
    }; 
    xhr.onerror = function() { 
        alert("ERROR!"); 
    }; 
    xhr.send();
}

// AJAX เรียก JSON file

// function pageLoad(){
//     var xhr = new XMLHttpRequest(); 
//     xhr.open("GET", "data_2.json"); 
//     xhr.onload = function() { 
//         var jsdata = JSON.parse(xhr.responseText);
//         console.log(jsdata);
//         display(jsdata);
//     }; 
//     xhr.onerror = function() { alert("ERROR!"); }; 
//     xhr.send();
// }

// function display(people){
//     console.log(Object.keys(people).length);
//     var showdiv = document.getElementById("people")
//     var keys = Object.keys(people);
//     for(var i =0; i< keys.length;i++){
        
//         var temp = document.createElement("p");
//         temp.innerHTML = people[keys[i]].first_name + " " + people[keys[i]].last_name + " Age: "+ people[keys[i]].age;
//         showdiv.appendChild(temp);
//     }
// }