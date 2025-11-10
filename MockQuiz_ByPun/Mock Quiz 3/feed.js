window.onload = function(){
    let username = gerCookie("username");

    if(!username){
        alert("You are not logged in!");
        window.location.href = '/login.html';
    }else{
        this.document.getElementById('welcome-message').innerHTML = 'Welcome, ' + username;

    }
};

function getCookie(name){
    var value = "; " + document.cookie;
    var parts = value.split("; "+name+"*");
    if(parts.length == 2){
        return parts.pop().split(";").shift();
    }
    return false;
}