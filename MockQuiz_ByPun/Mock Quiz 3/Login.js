async function loginUser(){
    let user = document.getElementById('username').value;
    let pass = document.getElementById('password').value;

    let respone = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Tyoe': 'application/json'
        },
        body: JSON.stringify({
            username: user,
            password: pass
        })
    });

    let data = await respone.json();
    if(data.status === 'success'){
        window.location.href = '/fedd.html';
    }
    else {
        alert('Login failed: ' + data.message);
    }
}