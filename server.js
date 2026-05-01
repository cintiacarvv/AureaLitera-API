const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados SQLite (Backend)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite (Backend).');
        
        // Criação das Tabelas do MVP
        db.serialize(() => {
            // Tabela de Usuários
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT
            )`);

            // Tabela de Livros/Catálogo (US09 - Gestão de Catálogo)
            db.run(`CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                author TEXT,
                format TEXT, -- 'fisico', 'ebook', 'audiobook' (US01)
                price REAL,
                cover_url TEXT,
                file_url TEXT,
                preview_url TEXT -- (US02 - Amostra antes da compra)
            )`);

            // Tabela da Estante Virtual (US05 e US07 - Biblioteca e Sincronização)
            db.run(`CREATE TABLE IF NOT EXISTS library (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                book_id INTEGER,
                progress_percentage REAL DEFAULT 0,
                last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(book_id) REFERENCES books(id)
            )`);
        });
    }
});

// ==========================================
// ROTAS DA API (Baseadas nas User Stories)
// ==========================================

// US01 – Busca com Filtro por Formato
app.get('/api/books', (req, res) => {
    const { format } = req.query;
    let query = 'SELECT * FROM books';
    let params =[];

    if (format) {
        query += ' WHERE format = ?';
        params.push(format);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// US05 – Acesso à Biblioteca Digital
app.get('/api/library/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT books.*, library.progress_percentage, library.last_accessed 
        FROM library 
        JOIN books ON library.book_id = books.id 
        WHERE library.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// US07 – Sincronização de progresso (Salvar progresso na nuvem)
app.post('/api/sync-progress', (req, res) => {
    const { user_id, book_id, progress_percentage } = req.body;
    
    const query = `
        UPDATE library 
        SET progress_percentage = ?, last_accessed = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND book_id = ?
    `;
    
    db.run(query, [progress_percentage, user_id, book_id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Progresso sincronizado com sucesso!', changes: this.changes });
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});