const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    // 1. Cria as tabelas primeiro
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, email TEXT UNIQUE, password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT, author TEXT, format TEXT, price REAL,
        cover_url TEXT, file_url TEXT, preview_url TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS library (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, book_id INTEGER,
        progress_percentage REAL DEFAULT 0,
        last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Insere os dados de teste
    db.run(`INSERT INTO users (name, email, password) VALUES ('Cintia', 'cintia@email.com', '123456')`);
    db.run(`INSERT INTO books (title, author, format, price) VALUES ('Hábitos Atômicos', 'James Clear', 'audiobook', 30.00)`);
    db.run(`INSERT INTO library (user_id, book_id, progress_percentage) VALUES (1, 1, 0)`);
    
    console.log("Banco de dados, Tabelas e Dados criados com SUCESSO!");
});