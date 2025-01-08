const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './database/users.json';

// Foydalanuvchi ro'yxatdan o'tkazish (POST)
router.post('/register', (req, res) => {
    const { username, password, fullName, age, email, gender } = req.body;

    if (!username || !password || !age || !email) {
        return res.status(400).json({ error: 'Username, password, age, and email are required' });
    }

    const users = JSON.parse(fs.readFileSync(path, 'utf8'));

    // Noyob username tekshiruvi
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const newUser = {
        id: users.length + 1,
        username,
        password,
        fullName,
        age,
        email,
        gender: gender || 'male',
    };

    users.push(newUser);
    fs.writeFileSync(path, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Foydalanuvchi profilini ko'rish (GET)
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;
    const users = JSON.parse(fs.readFileSync(path, 'utf8'));
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
});

// Foydalanuvchi profilini yangilash (PUT)
router.put('/profile/:username', (req, res) => {
    const { username } = req.params;
    const { fullName, age, email, gender } = req.body;
    const users = JSON.parse(fs.readFileSync(path, 'utf8'));

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.age = age || user.age;
    user.email = email || user.email;
    user.gender = gender || user.gender;

    fs.writeFileSync(path, JSON.stringify(users, null, 2));

    res.status(200).json({ message: 'User profile updated', user });
});

// Foydalanuvchi profilini o'chirish (DELETE)
router.delete('/profile/:username', (req, res) => {
    const { username } = req.params;
    const users = JSON.parse(fs.readFileSync(path, 'utf8'));

    const index = users.findIndex(u => u.username === username);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users.splice(index, 1);
    fs.writeFileSync(path, JSON.stringify(users, null, 2));

    res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = router;
