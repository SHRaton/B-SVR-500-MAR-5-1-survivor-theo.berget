const axios = require('axios');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 5000;

// Configuration de la base de données
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(cors());
app.use(express.json()); // Pour traiter le JSON dans les requêtes

// Fonction pour créer les tables si elles n'existent pas encore
const initializeDatabase = () => {
    // Préparer les déclarations pour créer les tables
    db.run('CREATE TABLE IF NOT EXISTS Users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, work TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, description TEXT, astrological_sign TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, max_participant INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS Encounters (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, date TEXT, rating INTEGER)');
};

// Initialiser la base de données
initializeDatabase();

const baseUrl = 'https://soul-connection.fr/api/employees'; // Base URL pour récupérer un employé
const clientUrl = 'https://soul-connection.fr/api/customers/';
const eventUrl = 'https://soul-connection.fr/api/events/';
const encounterUrl = 'https://soul-connection.fr/api/encounters/';

const config = {
    headers: {
        'X-Group-Authorization': '93aac6279a78460959c1118c15ec7e12',  // Clé API
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJqZWFubmUubWFydGluQHNvdWwtY29ubmVjdGlvbi5mciIsIm5hbWUiOiJKZWFubmUiLCJzdXJuYW1lIjoiTWFydGluIiwiZXhwIjoxNzI3MTg0NDE3fQ.zDR7OeZdu_6HOo9fj3h5FckZtc6R7OGEsTBcju8f6uk',
        'Content-Type': 'application/json'
    }
};

// Fonction pour récupérer un employé par ID
const getEmployeeById = async (id) => {
    try {
        const response = await axios.get(`${baseUrl}/${id}`, config);
        return response.data; // Récupère les données de l'employé
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'employé avec ID ${id}:`, error.response ? error.response.data : error.message);
        return null;
    }
};

// Fonction pour insérer un employé dans la base de données
const insertEmployeeIntoDB = (employee) => {
    const { email, name, surname, birth_date, gender, work } = employee;

    const stmt = db.prepare('INSERT INTO Users (email, name, surname, birth_date, gender, work) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(email, name, surname, birth_date, gender, work, function(err) {
        if (err) {
            console.error(`Erreur lors de l'insertion de l'employé:`, err.message);
        } else {
            console.log(`Employé avec ID inséré avec succès.`);
        }
    });
    stmt.finalize(); // Finaliser la déclaration préparée
};

// Fonction pour récupérer tous les employés jusqu'au dernier
const getAllEmployees = async () => {
    let id = 1;
    let employees = [];

    while (true) {
        const employee = await getEmployeeById(id);
        if (employee && employee.id) {
            employees.push(employee);
            insertEmployeeIntoDB(employee);
            id++;
        } else {
            break; // Sort de la boucle si l'employé n'existe pas
        }
    }

    console.log(`Nombre total d'employés récupérés: ${employees.length}`);
};

// Fonction pour récupérer un client par ID
const getCustomerByID = async (id) => {
    try {
        const response = await axios.get(`${clientUrl}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la sélection du client avec ID ${id}:`, error.response ? error.response.data : error.message);
        return null;
    }
};

// Fonction pour insérer un client dans la base de données
const insertCustomerIntoDB = (customer) => {
    const { email, name, surname, birth_date, gender, description, astrological_sign } = customer;

    const stmt = db.prepare('INSERT INTO Customers (email, name, surname, birth_date, gender, description, astrological_sign) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(email, name, surname, birth_date, gender, description, astrological_sign, function(err) {
        if (err) {
            console.error(`Erreur lors de l'insertion du client:`, err.message);
        } else {
            console.log(`Client avec ID inséré avec succès.`);
        }
    });
    stmt.finalize(); // Finaliser la déclaration préparée
};

// Fonction pour récupérer tous les clients jusqu'au dernier
const getAllCustomers = async () => {
    let id = 1;
    let customers = [];

    while (true) {
        const customer = await getCustomerByID(id);
        if (customer && customer.id) {
            customers.push(customer);
            insertCustomerIntoDB(customer);
            id++;
        } else {
            break; // Sort de la boucle si le client n'existe pas
        }
    }

    console.log(`Nombre total de clients récupérés: ${customers.length}`);
};

// Exécution des fonctions
getAllEmployees();
getAllCustomers();

// Démarrer le serveur Express
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
