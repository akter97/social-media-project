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
 // Sign Up Route
router.post("/signup", (req, res) => {
    const { userId, userName, userPassword, userImage } = req.body;

    // Check if userId already exists
    db.query("SELECT * FROM users WHERE userId = ?", [userId], (err, results) => {
        if (err) return res.json({ success: false, message: "Database error" });

        if (results.length > 0) {
            return res.json({ success: false, message: "User ID already exists. Please choose another." });
        }

        // Insert new user
        db.query(
            "INSERT INTO users (userId, userName, userPassword, userImage) VALUES (?, ?, ?, ?)",
            [userId, userName, userPassword, userImage],
            (err, result) => {
                if (err) return res.json({ success: false, message: "Error saving user" });
                return res.json({ success: true, message: "User registered successfully" });
            }
        );
    });
});
module.exports = router;