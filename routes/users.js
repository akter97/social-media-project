const express = require('express');
const router = express.Router();
const db = require('../db');

// Login route
router.post('/login', (req, res) => {
    const {userId, userPassword} = req.body;
    const sql = 'SELECT userId, userName, userImage FROM users WHERE userId=? AND userPassword=?';
    db.query(sql, [userId, userPassword], (err, result) => {
        if(err) return res.status(500).json({success:false, message:'DB error'});
        if(result.length > 0){
            res.json({success:true, user: result[0]});
        } else {
            res.json({success:false, message:'Invalid credentials'});
        }
    });
});

module.exports = router;