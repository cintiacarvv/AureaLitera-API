import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados local no dispositivo do usuário
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('livrariaLocalDB.db');
};

// Inicializa as tabelas locais (Offline Caching)
export const initLocalDB = async () => {
  const db = await openDatabase();
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    
    -- Tabela para guardar os livros baixados localmente para leitura/escuta offline
    CREATE TABLE IF NOT EXISTS local_books (
      id INTEGER PRIMARY KEY NOT NULL,
      book_id INTEGER UNIQUE,
      title TEXT,
      format TEXT,
      local_file_uri TEXT
    );

    -- Tabela para guardar o progresso offline antes de enviar para a API (US07)
    CREATE TABLE IF NOT EXISTS read_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id INTEGER UNIQUE,
      progress REAL,
      synced INTEGER DEFAULT 0 -- 0 = não sincronizado, 1 = sincronizado com a nuvem
    );
  `);
  console.log("Banco de dados local inicializado.");
};

// Função para salvar o progresso de leitura/áudio localmente
export const saveProgressLocally = async (bookId, progress) => {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO read_progress (book_id, progress, synced) 
     VALUES (?, ?, 0)`, 
    bookId, progress
  );
};

// Função para buscar progresso não sincronizado (Para rodar em background/quando voltar a internet)
export const getUnsyncedProgress = async () => {
  const db = await openDatabase();
  const allRows = await db.getAllAsync('SELECT * FROM read_progress WHERE synced = 0');
  return allRows;
};

// Marca o progresso como sincronizado após enviar para a API
export const markAsSynced = async (bookId) => {
  const db = await openDatabase();
  await db.runAsync(
    'UPDATE read_progress SET synced = 1 WHERE book_id = ?', 
    bookId
  );
};