const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express(); // <-- must be before app.use()

app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "client")));


// API routes
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/comments', require('./routes/comments'));

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});