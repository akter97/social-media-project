const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
    const { commentOfPostId, commentedUserId, commentText } = req.body;

    const sql = `
    INSERT INTO comments (commentOfPostId, commentedUserId, commentText, commentTime)
    VALUES (?, ?, ?, NOW())
    `;

    db.query(sql, [commentOfPostId, commentedUserId, commentText], (err) => {
        if(err) return res.status(500).json(err);
        res.json({message: 'Comment added'});
    });
});
// Get comments by postId
router.get('/:postId', (req, res) => {
    const postId = req.params.postId;

    const sql = `
    SELECT 
        comments.commentId,
        comments.commentText,
        comments.commentTime,
        users.userName AS commentedUsername,
        users.userImage AS commentedUserImage
    FROM comments
    JOIN users ON comments.commentedUserId = users.userId
    WHERE comments.commentOfPostId = ?
    ORDER BY comments.commentTime DESC
    `;

    db.query(sql, [postId], (err, result) => {
        if(err) return res.status(500).json(err);
        res.json(result);
    });
});

module.exports = router;