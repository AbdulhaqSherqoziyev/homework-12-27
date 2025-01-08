const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = './database/';

// JSON formatidagi ma'lumotlarni o'qish
function readData(fileName) {
    return JSON.parse(fs.readFileSync(`${path}${fileName}`, 'utf8'));
}

// Ma'lumotlarni yozish
function writeData(fileName, data) {
    fs.writeFileSync(`${path}${fileName}`, JSON.stringify(data, null, 2));
}

app.use(bodyParser.json()); // JSON formatidagi so'rovlar

// Foydalanuvchi va blog yo'nalishlarini import qilish
const userRoutes = require('./routes/users');
const blogRoutes = require('./routes/blog');

// Foydalanuvchi va blog yo'nalishlarini qo'shish
app.use('/users', userRoutes);
app.use('/blog', blogRoutes);

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
