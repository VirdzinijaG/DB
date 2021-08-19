import mysql from "mysql";

const conn = mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "nodejsnodejs",
    database: "zmones"
});

conn.connect();

conn.end();
