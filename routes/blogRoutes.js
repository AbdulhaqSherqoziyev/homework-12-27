const express = require('express');
const fs = require('fs');
const router = express.Router();

const BLOGS_DB = './database/blog.json';


const readBlogs = () => JSON.parse(fs.readFileSync(BLOGS_DB));
const writeBlogs = (data) => fs.writeFileSync(BLOGS_DB, JSON.stringify(data, null, 2));


router.post('/', (req, res) => {
  const { title, slug, content, tags } = req.body;

  if (!title || !slug || !content) {
    return res.status(400).json({ error: 'Title, slug, and content are required' });
  }

  const blogs = readBlogs();
  const newBlog = {
    id: blogs.length + 1,
    title,
    slug,
    content,
    tags,
    comments: [],
  };

  blogs.push(newBlog);
  writeBlogs(blogs);
  res.status(201).json(newBlog);
});


module.exports = router;
