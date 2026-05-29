const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Banco de Dados SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite (Backend).');

        db.serialize(() => {
            // Tabela de Usuários
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                phone TEXT,
                cep TEXT,
                street TEXT,
                number TEXT,
                complement TEXT,
                neighborhood TEXT,
                city TEXT,
                state TEXT,
                avatar_url TEXT
            )`);

            // Migrações seguras para colunas novas em bancos antigos
            const userMigrations = [
                `ALTER TABLE users ADD COLUMN phone TEXT`,
                `ALTER TABLE users ADD COLUMN cep TEXT`,
                `ALTER TABLE users ADD COLUMN street TEXT`,
                `ALTER TABLE users ADD COLUMN number TEXT`,
                `ALTER TABLE users ADD COLUMN complement TEXT`,
                `ALTER TABLE users ADD COLUMN neighborhood TEXT`,
                `ALTER TABLE users ADD COLUMN city TEXT`,
                `ALTER TABLE users ADD COLUMN state TEXT`,
                `ALTER TABLE users ADD COLUMN avatar_url TEXT`,
            ];
            userMigrations.forEach(sql => db.run(sql, () => {}));

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
                preview_url TEXT,
                rating REAL DEFAULT 0
            )`);

            db.run(`ALTER TABLE books ADD COLUMN rating REAL DEFAULT 0`, () => {});

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
// ROTAS DE USUÁRIOS (CRUD)
// ==========================================

// Cadastrar novo usuário
app.post('/api/users/register', (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }

    // Bloqueia cadastro com o email do admin
    if (email.toLowerCase() === 'admin@email.com') {
        return res.status(400).json({ error: 'Este email não pode ser usado para cadastro' });
    }

    db.run(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Este email já está cadastrado' });
                }
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                name,
                email,
                message: 'Conta criada com sucesso!'
            });
        }
    );
});

// Login de usuário (verifica admin hardcoded ou busca no banco)
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    // Admin hardcoded — nunca está no banco
    if (email === 'admin@email.com' && password === 'Admin@1') {
        return res.json({
            id: 0,
            name: 'Administrador',
            email: 'admin@email.com',
            isAdmin: true,
            message: 'Login realizado com sucesso!'
        });
    }

    // Busca usuário comum no banco
    db.get(
        `SELECT id, name, email FROM users WHERE email = ? AND password = ?`,
        [email, password],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(401).json({ error: 'Email ou senha incorretos' });

            res.json({
                id: row.id,
                name: row.name,
                email: row.email,
                isAdmin: false,
                message: 'Login realizado com sucesso!'
            });
        }
    );
});


// Verificar se email existe (Esqueci Senha - passo 1)
app.post('/api/users/check-email', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Admin não pode redefinir senha por aqui
    if (email.toLowerCase() === 'admin@email.com') {
        return res.status(404).json({ error: 'Email não encontrado' });
    }

    db.get(
        `SELECT id FROM users WHERE email = ?`,
        [email],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Email não encontrado' });
            res.json({ message: 'Email encontrado' });
        }
    );
});

// Redefinir senha (Esqueci Senha - passo 2)
app.post('/api/users/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ error: 'Email e nova senha são obrigatórios' });
    }

    db.run(
        `UPDATE users SET password = ? WHERE email = ?`,
        [newPassword, email],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json({ message: 'Senha atualizada com sucesso!' });
        }
    );
});

// Buscar dados do usuário por ID
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.get(
        `SELECT id, name, email, phone, cep, street, number, complement, neighborhood, city, state, avatar_url FROM users WHERE id = ?`,
        [id],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json(row);
        }
    );
});

// Atualizar dados do usuário
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, cep, street, number, complement, neighborhood, city, state, avatar_url } = req.body;

    db.run(
        `UPDATE users SET name=?, email=?, phone=?, cep=?, street=?, number=?, complement=?, neighborhood=?, city=?, state=?, avatar_url=? WHERE id=?`,
        [name, email, phone, cep, street, number, complement, neighborhood, city, state, avatar_url, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
            res.json({ message: 'Perfil atualizado com sucesso!' });
        }
    );
});

// Deletar conta do usuário
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json({ message: 'Conta excluída com sucesso!' });
    });
});

// ==========================================
// ROTAS DE LIVROS
// ==========================================

app.get('/api/books', (req, res) => {
    const { format, category } = req.query;
    let query = 'SELECT * FROM books';
    let params = [];
    let conditions = [];

    if (format) { conditions.push('format = ?'); params.push(format); }
    if (category) { conditions.push('category = ?'); params.push(category); }
    if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/books', (req, res) => {
    const { title, author, format, price, cover_url, pages, category, description, rating } = req.body;
    if (!title || !author) return res.status(400).json({ error: 'Título e autor são obrigatórios' });

    db.run(
        `INSERT INTO books (title, author, format, price, cover_url, pages, category, description, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, author, format || null, price || 0, cover_url || null, pages || null, category || null, description || null, rating || 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Livro cadastrado com sucesso!' });
        }
    );
});

app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, format, price, cover_url, pages, category, description, rating } = req.body;
    db.run(
        `UPDATE books SET title=?, author=?, format=?, price=?, cover_url=?, pages=?, category=?, description=?, rating=? WHERE id=?`,
        [title, author, format, price, cover_url, pages, category, description, rating || 0, id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Livro não encontrado' });
            res.json({ message: 'Livro atualizado com sucesso!' });
        }
    );
});

app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM books WHERE id = ?`, [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Livro não encontrado' });
        res.json({ message: 'Livro excluído com sucesso!' });
    });
});

// ==========================================
// ROTAS DE BIBLIOTECA
// ==========================================

app.get('/api/library/:userId', (req, res) => {
    const userId = req.params.userId;
    db.all(
        `SELECT books.*, library.progress_percentage, library.last_accessed
         FROM library JOIN books ON library.book_id = books.id WHERE library.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.post('/api/sync-progress', (req, res) => {
    const { user_id, book_id, progress_percentage } = req.body;
    db.run(
        `UPDATE library SET progress_percentage = ?, last_accessed = CURRENT_TIMESTAMP WHERE user_id = ? AND book_id = ?`,
        [progress_percentage, user_id, book_id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Progresso sincronizado com sucesso!', changes: this.changes });
        }
    );
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});