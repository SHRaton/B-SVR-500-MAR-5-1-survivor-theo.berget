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
    db.run('CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, description TEXT, astrological_sign TEXT, phone_number TEXT, adress TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, max_participant INTEGER, location_x INTEGER, location_y INTEGER, type TEXT, employee_id INTEGER, location_name TEXT, FOREIGN KEY (employee_id) REFERENCES Users(id))');
    db.run('CREATE TABLE IF NOT EXISTS Encounters (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, date TEXT, rating INTEGER, comment TEXT, source TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, tip TEXT)');
};

// Initialiser la base de données
initializeDatabase();

const baseUrl = 'https://soul-connection.fr/api/employees'; // Base URL pour récupérer un employé
const clientUrl = 'https://soul-connection.fr/api/customers/';
const eventUrl = 'https://soul-connection.fr/api/events/';
const encounterUrl = 'https://soul-connection.fr/api/encounters/';
const tipsUrl = 'https://soul-connection.fr/api/tips';

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

const employeeExists = (email, callback) => {
    db.get('SELECT id FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'employé:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Fonction pour insérer un employé dans la base de données
const insertEmployeeIntoDB = (employee) => {
    const { email, name, surname, birth_date, gender, work } = employee;

    employeeExists(email, (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`L'employé avec l'email ${email} existe déjà.`);
            return;
        }

        const stmt = db.prepare('INSERT INTO Users (email, name, surname, birth_date, gender, work) VALUES (?, ?, ?, ?, ?, ?)');
        stmt.run(email, name, surname, birth_date, gender, work, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion de l'employé:`, err.message);
            } else {
                console.log(`Employé avec ID inséré avec succès.`);
            }
        });
        stmt.finalize(); // Finaliser la déclaration préparée
    });
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

const customerExists = (email, callback) => {
    db.get('SELECT id FROM Customers WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'employé:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Fonction pour insérer un client dans la base de données
const insertCustomerIntoDB = (customer) => {
    const { email, name, surname, birth_date, gender, description, astrological_sign, phone_number, adress } = customer;

    customerExists(email, (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`Le client avec l'email ${email} existe déjà.`);
            return;
        }

        const stmt = db.prepare('INSERT INTO Customers (email, name, surname, birth_date, gender, description, astrological_sign, phone_number, adress) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(email, name, surname, birth_date, gender, description, astrological_sign, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion du client:`, err.message);
            } else {
                console.log(`Client avec ID inséré avec succès.`);
            }
        });
        stmt.finalize(); // Finaliser la déclaration préparée
    });
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

const encounterExists = (customer_id, date, comment, callback) => {
    db.get('SELECT id FROM Encounters WHERE customer_id = ? AND date = ? AND comment = ?', [customer_id, date, comment], (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection du rendez-vous:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Fonction pour insérer un rendez-vous dans la base de données
const insertEncounterIntoDB = (encounter) => {
    const { customer_id, date, rating, comment, source } = encounter;

    encounterExists(customer_id, date, comment, (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`Le rendez-vous avec la date ${date} existe déjà.`);
            return;
        }


        const stmt = db.prepare('INSERT INTO Encounters (customer_id, date, rating, comment, source) VALUES (?, ?, ?, ?, ?)');
        stmt.run(customer_id, date, rating, comment, source, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion du rendez-vous:`, err.message);
            } else {
                console.log(`Rendez-vous avec ID inséré avec succès.`);
            }
        });
        stmt.finalize(); // Finaliser la déclaration préparée
    });
};

const getEncoutersByID = async (id) => {
    try {
        const response = await axios.get(`${encounterUrl}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la sélection du rendez-vous avec ID ${id}:`, error.response ? error.response.data : error.message);
        return null;
    }
};

const getAllEncouters = async () => {
    let id = 1;
    let encounters = [];

    while (true) {
        const encounter = await getEncoutersByID(id);
        if (encounter && encounter.id) {
            encounters.push(encounter);
            insertEncounterIntoDB(encounter);
            id++;
        } else {
            break; // Sort de la boucle si le rendez-vous n'existe pas
        }
    }

    console.log(`Nombre total de rendez-vous créés: ${encounters.length}`);
};

const eventsExists = (date, location_x, location_y, employee_id, callback) => {
    db.get('SELECT id FROM Events WHERE date = ? AND location_x = ? AND location_y = ? AND employee_id = ?', [date, location_x, location_y, employee_id], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'employé:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

const insertEventIntoDB = (event) => {
    const { name, date, max_participant, location_x, location_y, type, employee_id, location_name } = event;

    eventsExists(date, location_x, location_y, employee_id, (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`L'event avec la date ${date} existe déjà.`);
            return;
        }


        const stmt = db.prepare('INSERT INTO Events (name, date, max_participant, location_x, location_y, type, employee_id, location_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(name, date, max_participant, location_x, location_y, type, employee_id, location_name, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion de l'event:`, err.message);
            } else {
                console.log(`Event avec ID inséré avec ℝ.`);
            }
        });
        stmt.finalize(); // Finaliser la déclaration préparée
    });
}

const getEventById = async (id) => {
    try {
        const response = await axios.get(`${eventUrl}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(`Erreur lors de la sélection de l'event avec ID ${id}:`, error.response ? error.response.data : error.message);
        return null;
    }
};

const getAllEvents = async () => {
    let id = 1;
    let events = [];

    while (true) {
        const event = await getEventById(id);
        if (event && event.id) {
            events.push(event);
            insertEventIntoDB(event);
            id++;
        } else {
            break; // Sort de la boucle si l'event n'existe pas
        }
    }

    console.log(`Nombre total d'events créés: ${events.length}`);
};


const fetchAndInsertTips = async () => {
    try {
        const response = await axios.get(`${tipsUrl}`, config); // Remplacez par votre URL
        const tips = response.data; // Supposons que la réponse soit un tableau d'objets

        for (const tip of tips) {
            insertTipsIntoDB(tip);
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error.message);
    }
};

const tipsExists = (title, callback) => {
    db.get('SELECT id FROM Tips WHERE title = ?', [title], (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'employé:', err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

const insertTipsIntoDB = (tips) => {
    const { title, tip } = tips;

    tipsExists(title, (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`Le tip avec le titre ${title} existe déjà.`);
            return;
        }

        const stmt = db.prepare('INSERT INTO Tips (title, tip) VALUES (?, ?)');
        stmt.run(title, tip, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion du record avec ID ${this.lastID}:`, err.message);
            } else {
                console.log(`Record inséré avec succès, ID ${this.lastID}.`);
            }
        });
        stmt.finalize(); // Finaliser la déclaration préparée
    });
};


app.get('/api/tips', (req, res) => {
    db.all('SELECT * FROM Tips', [], (err, rows) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      });
    });
  });

  app.get('/api/customers', (req, res) => {
    db.all('SELECT * FROM Customers', [], (err, rows) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      });
    });
  });

function addEmployee(name, surname, birth_date, gender, work) {
    const stmt = db.prepare('INSERT INTO Employees (name, surname, birth_date, gender, work) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, surname, birth_date, gender, work);
    return info.lastInsertRowid; // Renvoie l'id de l'employé ajouté
}


//Exécution des fonctions
getAllEmployees();
getAllCustomers();
getAllEncouters();
getAllEvents();
fetchAndInsertTips();

// Démarrer le serveur Express
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
