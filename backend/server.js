const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
}));

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// SQLite3 Database setup
const db = new sqlite3.Database(path.join(__dirname, '..', 'database', 'users.db'), (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create users table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);
});

// Routes
app.get('/', redirectToDashboardIfLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    // Log the received data to check
    console.log('Received data:', username, password);

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            console.log('Error:', err.message); // Log any errors
            return res.status(400).send('User already exists');
        }
        res.status(201).send('User registered successfully');
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        if (!row || !bcrypt.compareSync(password, row.password)) {
            return res.status(401).send('Invalid credentials');
        }

        req.session.userId = row.id;
        res.status(200).send('Login successful');
    });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/');
    });
});

// Middleware to protect routes
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).send('You must be logged in to access this page');
    }
    next();
}

// Middleware to redirect already logged-in users
function redirectToDashboardIfLoggedIn(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
}

// Apply middleware to login route
app.get('/login.html', redirectToDashboardIfLoggedIn, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Protected route
app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
