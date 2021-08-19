import mysql from "mysql";

const conn = mysql.createConnection({
    host: "localhost",
    user: "nodejs",
    password: "nodejs123456",
    database: "zmones"
});


function dbConnect() {
    return new Promise((resolve, reject) => {
        conn.connect((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
function dbDisconnect() {
    return new Promise((resolve, reject) => {
        conn.end((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function dbQuery() {
    return new Promise((resolve, reject) => {
        conn.query(...arguments, (err, results, fields)=> {
            if (err) {
                reject(err);
                return;
            }
            let args = {results, fields};
            resolve(args);
        });
    });
}


try {
    await dbConnect();
    let rez = await dbQuery("select 1 as vienas");
    console.log(rez);
    console.log("prisijungiau");
} catch (err) {
    console.log("Klaida: ", err);
} finally {
    try {
        await dbDisconnect();
    } catch (err) {
        // ignored
    }
    console.log("atsijungiau");
}


