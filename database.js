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

        db.serialize(() => {
            // Tabela de Usuários
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT
            )`);

            // Tabela de Livros/Catálogo
            db.run(`CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                author TEXT,
                format TEXT,
                price REAL DEFAULT 0,
                cover_url TEXT,
                file_url TEXT,
                pages TEXT,
                category TEXT,
                description TEXT,
                preview_url TEXT
            )`);

            // Migração: adiciona colunas que podem estar faltando em bancos antigos
            const migrations = [
                `ALTER TABLE books ADD COLUMN pages TEXT`,
                `ALTER TABLE books ADD COLUMN category TEXT`,
                `ALTER TABLE books ADD COLUMN description TEXT`,
                `ALTER TABLE books ADD COLUMN file_url TEXT`,
                `ALTER TABLE books ADD COLUMN preview_url TEXT`,
                `ALTER TABLE books ADD COLUMN price REAL DEFAULT 0`,
                `ALTER TABLE books ADD COLUMN cover_url TEXT`,
            ];
            migrations.forEach(sql => {
                db.run(sql, (err) => {
                    // Ignora erro "duplicate column name" — coluna já existe
                });
            });

            // Tabela da Estante Virtual
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
// ROTAS DE LIVROS
// ==========================================

// Listar livros (com filtro opcional por formato)
app.get('/api/books', (req, res) => {
    const { format } = req.query;
    let query = 'SELECT * FROM books';
    let params = [];

    if (format) {
        query += ' WHERE format = ?';
        params.push(format);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Cadastrar novo livro
app.post('/api/books', (req, res) => {
    const { title, author, format, price, cover_url, pages, category, description } = req.body;

    if (!title || !author) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
    }

    const query = `INSERT INTO books (title, author, format, price, cover_url, pages, category, description)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [title, author, format || null, price || 0, cover_url || null, pages || null, category || null, description || null], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, message: 'Livro cadastrado com sucesso!' });
    });
});

// Excluir livro
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Livro não encontrado' });
        res.json({ message: 'Livro excluído com sucesso!' });
    });
});

// ==========================================
// ROTAS DE BIBLIOTECA
// ==========================================

// Biblioteca de um usuário
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

// Sincronizar progresso de leitura
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