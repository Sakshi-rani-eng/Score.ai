const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Use /tmp directory for data storage in production (Vercel), otherwise use local /data directory
const dataDir = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

// Helper function to read users
const readUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Helper function to write users
const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to users file:', error);
        return false;
    }
};

// API: Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// API: User Registration
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const users = readUsers();
    
    if (users.some(user => user.email === email)) {
        return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // In a real app, hash this password
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    
    if (writeUsers(users)) {
        res.status(201).json({ success: true, message: 'Registration successful' });
    } else {
        res.status(500).json({ success: false, message: 'Failed to save user data' });
    }
});

// API: User Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = readUsers();
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) { // In a real app, compare hashed passwords
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email }
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;
