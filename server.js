const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files

const csvFilePath = path.join(__dirname, 'users.csv');

// API Routes
app.post('/api/register', (req, res) => {
    console.log('Received registration request:', req.body);
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        console.log('Registration failed: Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    // In a real app, you would hash the password
    const newUser = `${name},${email},${password}\n`;

    // Append user to CSV file
    fs.appendFile(csvFilePath, newUser, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
            return res.status(500).json({ message: 'Error saving user data' });
        }
        console.log('Successfully registered user:', email);
        res.status(200).json({ message: 'Registration successful' });
    });
});

app.post('/api/login', (req, res) => {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        console.log('Login failed: Missing fields');
        return res.status(400).json({ message: 'Email and password are required' });
    }

    // Read users from CSV file
    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading CSV file:', err);
            return res.status(500).json({ message: 'Error reading user data' });
        }

        const lines = data.trim().split('\n').filter(line => line.trim());
        const parsedUsers = lines.slice(1).map(line => {
            const parts = line.split(',');
            if (parts.length >= 3) {
                const [name, userEmail, userPassword] = parts;
                return { name: name.trim(), email: userEmail.trim(), password: userPassword.trim() };
            }
            return null;
        }).filter(user => user !== null);

        console.log('Parsed users:', parsedUsers);

        // Find user by email
        const user = parsedUsers.find(u => u.email === email);
        
        if (!user) {
            console.log('Login failed: User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password (in a real app, you would compare hashed passwords)
        if (user.password !== password) {
            console.log('Login failed: Incorrect password');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        console.log('Successfully logged in user:', email);
        res.status(200).json({ message: 'Login successful', user: { name: user.name, email: user.email } });
    });
});

// Catch-all route to serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
