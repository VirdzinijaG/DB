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
        conn.query(...arguments, (err, results, fields) => {
            if (err) {
                reject(err);
                return;
            }
            let args = { results, fields };
            resolve(args);
        });
    });
}

function printTable(rez) {
    let text = "";
    for (const col of rez.fields) {
        text += col.name + "\t";
    }
    console.log(text);
    for (const row of rez.results) {
        text + "";
        for (const col of rez.fields) {
            text += row[col.name] + "\t";
        }
        console.log(text);
    }
}


try {
    await dbConnect();
    let rez = await dbQuery("select * from zmones");
    // console.log(rez);
    // console.log("prisijungiau");
    printTable(rez);
    console.log("--------------------------------");
    rez = await dbQuery("select * from kontaktai");
    printTable(rez);
    console.log("--------------------------------");
    rez = await dbQuery(`
    select vardas, pavarde, tipas, reiksme
    from zmones left join kontaktai on zmones.id = kontaktai.zmones_id
    order by vardas, pavarde
    `);
    printTable(rez);
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


