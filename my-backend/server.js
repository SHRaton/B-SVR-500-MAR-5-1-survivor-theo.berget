const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

const db = new sqlite3.Database('./database.db');

// Fonction pour créer les tables si elles n'existent pas encore
const initializeDatabase = () => {
  // Préparer les déclarations pour créer les tables
  const createUsersTable = db.prepare('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, work TEXT)');
  const createCustomersTable = db.prepare('CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, description TEXT, astrological_sign TEXT)');
  const createEventsTable = db.prepare('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, max_participant INTEGER)');
  const createEncountersTable = db.prepare('CREATE TABLE IF NOT EXISTS Encounters (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, date TEXT, rating INTEGER)');

  // Exécuter les déclarations pour créer les tables
  createUsersTable.run();
  createCustomersTable.run();
  createEventsTable.run();
  createEncountersTable.run();

  // Finaliser les déclarations
  createUsersTable.finalize();
  createCustomersTable.finalize();
  createEventsTable.finalize();
  createEncountersTable.finalize();
};

// Initialiser la base de données
initializeDatabase();

// Exemple de route pour vérifier les tables
app.get('/api/tables', (req, res) => {
  db.all("SELECT name FROM sqlite_master WHERE type='table';", (err, tables) => {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.json(tables);
  });
});

// Route pour ajouter un utilisateur (exemple)
app.post('/api/users', express.json(), (req, res) => {
  const { email, name, surname, birth_date, gender, work } = req.body;

  const stmt = db.prepare('INSERT INTO Users (email, name, surname, birth_date, gender, work) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(email, name, surname, birth_date, gender, work, function(err) {
    if (err) {
      res.status(400).json({"error": err.message});
      return;
    }
    res.status(201).json({ id: this.lastID });
  });
  stmt.finalize();
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
