const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Post = require('../models/Post');

router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { description, email } = req.body;
    const imageUrl = req.file ? req.file.filename : '';

    const post = new Post({
      description,
      email,
      imageUrl
    });

    await post.save();
    res.status(201).send('Post created successfully!');
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).send('Server Error');
  }
});
router.get('/my-posts/:email',async(req,res)=>{
  try{
    const posts=await Post.find({email:req.params.email}).sort({createdAt:-1});
    res.json(posts);
  }catch (err){
    console.error('Error fetching posts:', err);
  }
});
module.exports = router;
