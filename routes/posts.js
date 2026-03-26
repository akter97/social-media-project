const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all posts with user info
router.get('/', (req, res) => {
    const sql = `
    SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, 
           posts.postId, posts.postedTime, posts.postText, posts.postImageUrl
    FROM posts
    INNER JOIN users ON posts.postedUserId = users.userId
    ORDER BY posts.postedTime DESC
    `;
    db.query(sql, (err, results) => {
        if(err) return res.status(500).json({error: err});
        res.json(results);
    });
});

// Create a new post
router.post('/', (req, res) => {
    const { postedUserId, postText, postImageUrl } = req.body;
    const sql = `INSERT INTO posts (postedUserId, postedTime, postText, postImageUrl) 
                 VALUES (?, NOW(), ?, ?)`;
    db.query(sql, [postedUserId, postText, postImageUrl], (err, result) => {
        if(err) return res.status(500).json({error: err});
        res.json({message: 'Post created', postId: result.insertId});
    });
});

module.exports = router;