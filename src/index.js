import readline from "readline"; // importuojamas modulis readline
import mysql from "mysql"; // importuojamas mysql modulis

const rl = readline.createInterface({ // funkcija teksto ivedimui terminale
    input: process.stdin,
    output: process.stdout,
});

function inputText(msg) {
    return new Promise((resolve) => {
        rl.question(msg, (text) => {
            resolve(text);
        });
    });
}

const conn = mysql.createConnection({ // prisijungimas prie mysql serverio
    host: "localhost",
    user: "nodejs",
    password: "nodejs123456",
    database: "zmones", // duomenu bazes pavadinimas
    multipleStatements: true, // sio parametro default yra false
});

// conn.connect(); prisijungimas prie servverio, callback
// console.log("Prisijungiau");

// conn.end(); atsijungimas nuo serverio
// console.log("Atsijungiau"); 

function dbConnect() { // connect, kur grazina promise // prisijungimas
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

function dbDisconnect() { // atsijungimas
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

function dbQuery() { // uzklausa i serveri conn.query // funkcija su promise
    return new Promise((resolve, reject) => {
        conn.query(...arguments, (err, results, fields) => { // ...arguments, paduodami visi gaunami parametrai // (err, results, fields) - callback
            if (err) {
                reject(err);
                return;
            }
            resolve({ // resolve galima paduoti viena parametra // results ir fields sudetas i objekta, kad butu vienas paramtras
                results,
                fields,
            });
            // kitas uzrasymas
            // let args = {results, fields};
            // resolve(args)
        });
    });
}

function printTable(r) { // lenteles sudarymas
    let text = "";
    for (const col of r.fields) { // stulpeliu pavadinimai vienoje eiluteje
        text += col.name + "\t";
    }
    console.log(text);
    for (const row of r.results) {
        text = "";
        for (const col of r.fields) {
            text += row[col.name] + "\t";
        }
        console.log(text);
    }
}

try {
    await dbConnect();
    // let r = await dbQuery("select 1 as vienas, 2 + 3 as suma"); // pildomi parametrai kaip mysql
    let r = await dbQuery("select * from zmones"); 
    printTable(r);
    console.log("------------------------------------------------");
    r = await dbQuery("select * from kontaktai");
    printTable(r);
    console.log("------------------------------------------------");

    //      await dbQuery(
    //     "insert into zmones(vardas, pavarde) values ('vardenis', 'pavardenis')",
    //   ); // nauju duomenu ivedimas

    // await dbQuery(
    //  "update zmones set alga = 563.42");
    // duomenu atnaujinimas, tokius atveju pakeis visu algas 

    // await dbQuery(
    //  "update zmones set alga = 563.42 where id = 4");
    // duomenu atnaujinimas,pakeis alga tam, kurio id yra 4

    //let vardas = "Vardenis"; // "Vardeni's - syntax error"
    // let alga = 789;
    // let id = 4;

    // await dbQuery (
    // `update zmones set vardas = '${vardas}', alga = ${alga} where id = ${id}`
   // )


   // inputText kvieciama funkcija su await, bus isvedama terminale klausimas ir tada vedama reiksme, grazina kaip string'a
    let vardas = await inputText("Naujas vardas: "); // Terminale bus naudojimas Naujas vardas ir jis tada ivedamas
    let alga = parseFloat(await inputText("Kokia bus alga?: ")); // Terminale ismetamas klausimas // parseFloat pavercia skaiciumi
    let id = parseInt(await inputText("Koks id: ")); // Terminale ismetamas klausimas // parseInt gaunamas sveikas skaicius
    await dbQuery(
        `update zmones set vardas = ?, alga = ?, gim_data = ? where id = ?`,
        [vardas, alga, new Date(), id] // masyvas su tiek elementu, kiek yra klaustuku
    );
    // parasius id, jei suras toki id tada update padarys
    // jei iterpiant nauja irasa, nauja id sukurs, auto increment

    r = await dbQuery(`
  select vardas, pavarde, tipas, reiksme
  from zmones left join kontaktai on zmones.id = kontaktai.zmones_id
  order by vardas, pavarde
  `);
    printTable(r);
} catch (err) {
    console.log("Klaida: ", err);
} finally {
    try {
        await dbDisconnect();
    } catch (err) {
        // ignored
    }
    rl.close();
}