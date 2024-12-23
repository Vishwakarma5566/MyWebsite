function handleLogout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }).then(response => {
        if (response.ok) {
            window.location.href = '/';
        } else {
            response.text().then(text => alert(text));
        }
    });
}

// Function to handle buy action
function handleBuy(item) {
    alert(`You have successfully purchased ${item}. Thank you!`);
    window.location.href = '/payment'; // Placeholder for payment page
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
