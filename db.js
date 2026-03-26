const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "social_media"
});

db.connect((err) => {
    if(err){
        console.log("Database Error");
    } else {
        console.log("Database Connected");
    }
});

module.exports = db;