const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = './database/blog.json';

// Yangi blog yozuvi yaratish (POST)
router.post('/', (req, res) => {
    const { title, slug, content, tags } = req.body;

    if (!title || !slug || !content || !Array.isArray(tags)) {
        return res.status(400).json({ error: 'Invalid blog data' });
    }

    const blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

    const newBlog = {
        id: blogs.length + 1,
        title,
        slug,
        content,
        tags,
        comments: []
    };

    blogs.push(newBlog);
    fs.writeFileSync(path, JSON.stringify(blogs, null, 2));

    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
});

// Blog yozuvlarini ko'rish (GET)
router.get('/', (req, res) => {
    const blogs = JSON.parse(fs.readFileSync(path, 'utf8'));
    res.status(200).json(blogs);
});

// Blog yozuvini yangilash (PUT)
router.put('/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const { title, slug, content, tags } = req.body;

    const blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    if (blogIndex === -1) {
        return res.status(404).json({ error: 'Blog not found' });
    }

    blogs[blogIndex] = { ...blogs[blogIndex], title, slug, content, tags };

    fs.writeFileSync(path, JSON.stringify(blogs, null, 2));

    res.status(200).json({ message: 'Blog updated successfully', blog: blogs[blogIndex] });
});

// Blog yozuvini o'chirish (DELETE)
router.delete('/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const blogs = JSON.parse(fs.readFileSync(path, 'utf8'));

    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    if (blogIndex === -1) {
        return res.status(404).json({ error: 'Blog not found' });
    }

    blogs.splice(blogIndex, 1);
    fs.writeFileSync(path, JSON.stringify(blogs, null, 2));

    res.status(200).json({ message: 'Blog deleted successfully' });
});

module.exports = router;
