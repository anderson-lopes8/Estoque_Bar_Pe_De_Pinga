import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('estoque.db');

export const initDatabase = () => {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS fornecedores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cnpj TEXT,
        endereco TEXT,
        telefone TEXT,
        bairro TEXT,
        cidade TEXT,
        estado TEXT,
        email TEXT
    );

    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        preco REAL NOT NULL CHECK (preco >= 0),
        quantidade INTEGER NOT NULL DEFAULT 0 CHECK (quantidade >= 0),
        estoque_minimo INTEGER NOT NULL DEFAULT 5,
        fornecedor_id INTEGER,
        FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS movimentacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        tipo TEXT NOT NULL CHECK (tipo IN ('ENTRADA', 'SAIDA')),
        quantidade INTEGER NOT NULL CHECK (quantidade > 0),
        observacao TEXT,
        data TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
    );
  `);
};