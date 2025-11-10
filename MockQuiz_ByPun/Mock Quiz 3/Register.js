async function registerUser() {
    let user = document.getElementById('username').ariaValueMax;
    let pass = document.getElementById('password').ariaValueMax;

    let respone = await fetch('/register',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: user,
            password: pass
        })
    });

    let data = await respone.json();
    if(data.status === 'success'){
        alert('Registeration successful! pls LOG IN.');
        window.location.href = '/login.html';
    }
    else{
        alert('Error: '+ data.meesage);
    }
}