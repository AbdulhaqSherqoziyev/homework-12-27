const express = require('express');
const fs = require('fs');
const router = express.Router();

const USERS_DB = './database/users.json';


const readUsers = () => JSON.parse(fs.readFileSync(USERS_DB));
const writeUsers = (data) => fs.writeFileSync(USERS_DB, JSON.stringify(data, null, 2));

router.post('/register', (req, res) => {
  const { username, password, fullName, age, email, gender } = req.body;

  if (!username || username.length < 3) return res.status(400).json({ error: 'Invalid username' });
  if (!password || password.length < 5) return res.status(400).json({ error: 'Invalid password' });
  if (age < 10) return res.status(400).json({ error: 'Age must be 10 or above' });

  const users = readUsers();
  if (users.find((user) => user.username === username || user.email === email)) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }

  const newUser = {
    id: users.length + 1,
    username,
    password,
    fullName,
    age,
    email,
    gender,
  };

  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});



module.exports = router;
