async function login() {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const errorP = document.getElementById('error'); 
    if(!userId || !password) {
        errorP.innerText = 'Please enter User ID and Password';
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userId, userPassword: password})
        });

        const data = await res.json();

        if(data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            errorP.innerText = data.message;
        }
    } catch(err) {
        console.log(err);
        errorP.innerText = 'Server error, try again';
    }
}
function signupPage() {
    window.location.href = "signup.html"; 
}