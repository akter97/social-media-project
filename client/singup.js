 async function createSignup() {
    const userId = document.getElementById('userId').value;
    const userName = document.getElementById('userName').value;
    const userPassword = document.getElementById('userPassword').value; 
    const userImage = document.getElementById('userImage').value;

    if (!userId || !userName || !userPassword || !userImage) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Fields',
            text: 'All fields are required!'
        });
        return;
    }

    try {
        const res = await fetch('http://localhost:5000/api/users/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId,
                userName,
                userPassword,
                userImage
            })
        });

        const result = await res.json();

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Account created successfully!'
            }).then(() => {
                window.location.href = "index.html";
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: result.message 
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Something went wrong!'
        });
    }
}
