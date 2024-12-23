function showModal() {
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function showAboutPopup() {
    alert('This feature will be enabled soon.');
}

function showLoginModal() {
    document.getElementById('modal-title').textContent = 'Login';
    document.querySelector('.login-button').style.display = 'inline-block';
    document.querySelector('.register-button').style.display = 'none';
    document.querySelector('.register-link').style.display = 'inline-block'; // Show the register link
    showModal();
}

function showRegisterModal() {
    document.getElementById('modal-title').textContent = 'Register';
    document.querySelector('.login-button').style.display = 'none';
    document.querySelector('.register-button').style.display = 'inline-block';
    document.querySelector('.register-link').style.display = 'none'; // Hide the register link
    showModal();
}

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Login successful') {
            closeModal(); // Close modal after login
            window.location.href = '/dashboard';
        } else {
            alert(data);
        }
    });
}

function handleRegister() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'User registered successfully') {
            alert('Registration successful! You can now login.');
            showLoginModal();
        } else {
            alert(data);
        }
    });
}

// Prevent back navigation
window.onload = function() {
    if (window.history && window.history.pushState) {
        window.history.pushState(null, null, window.location.href);
        window.onpopstate = function() {
            window.history.pushState(null, null, window.location.href);
        };
    }
};