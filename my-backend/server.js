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
    db.run('CREATE TABLE IF NOT EXISTS Customers (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, name TEXT, surname TEXT, birth_date TEXT, gender TEXT, description TEXT, astrological_sign TEXT, phone_number TEXT, address TEXT, coach_id INTEGER, FOREIGN KEY (coach_id) REFERENCES Users(id))');
    db.run('CREATE TABLE IF NOT EXISTS Events (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, max_participant INTEGER, location_x INTEGER, location_y INTEGER, type TEXT, employee_id INTEGER, location_name TEXT, FOREIGN KEY (employee_id) REFERENCES Users(id))');
    db.run('CREATE TABLE IF NOT EXISTS Encounters (id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER, date TEXT, rating INTEGER, comment TEXT, source TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Tips (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, tip TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS Clothes (id INTEGER, type TEXT, customer_id INTEGER, FOREIGN KEY (customer_id) REFERENCES Customers(id))');
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
            }
        });
        createEmployeePngFile(employee.id); // Créer un fichier PNG pour l'employé
        stockEmployeeImage(employee.id); // Stocker l'image dans la base de données
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
    const { email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address } = customer;

    customerExists(email, (err, row) => {
        if (err) {
            console.error('Erreur lors de la sélection avant l\'insertion:', err.message);
            return;
        }
        if (row) {
            console.log(`Le client avec l'email ${email} existe déjà.`);
            return;
        }

        const stmt = db.prepare('INSERT INTO Customers (email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        stmt.run(email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address, function(err) {
            if (err) {
                console.error(`Erreur lors de l'insertion du client:`, err.message);
            }
        });
        createCustomerPngFile(customer.id); // Créer un fichier PNG pour le client
        stockCustomerImage(customer.id); // Stocker l'image dans la base de données
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

async function processAllCustomers() {
    // Récupérer tous les clients dans la base de données
    db.all(`SELECT id FROM Customers`, [], (err, customers) => {
      if (err) {
        console.error("Erreur lors de la récupération des clients :", err.message);
        return;
      }
      // Boucle à travers chaque client
      customers.forEach((customer) => {
        const customerId = customer.id;
        console.log(`Traitement des vêtements pour le client ${customerId}`);
        // Appeler la fonction qui récupère et insère les vêtements pour ce client
        fetchAndInsertClothes(customerId);
      });
    });
  }

async function fetchAndInsertClothes(customerId) {
  try {
    // Utilisation du config avec axios.get pour inclure les headers
    const response = await axios.get(`https://soul-connection.fr/api/customers/${customerId}/clothes`, config);
    const clothesList = response.data; // Supposons que la réponse est un tableau d'objets
    // Boucle sur la liste des vêtements et insertion dans la table Clothes
    clothesList.forEach((clothingItem) => {
      const {id, type } = clothingItem;
      db.run(
        `INSERT INTO Clothes (id, Type, customer_id) VALUES (?, ?, ?)`,
        [id, type, customerId],
        function (err) {
          if (err) {
            return console.error(err.message);
          }
          console.log(`Vêtement inséré pour le client ${customerId}`);
        }
      );
      createClothesPngFile(clothingItem.id); // Stocker l'image dans la base de données
    });
  } catch (error) {
    console.error(`Erreur lors de la récupération des vêtements pour le client ${customerId}:`, error);
  }
}

const createEmployeePngFile = (id) => {
    const fs = require('fs');
    // Exemple de chaîne base64 représentant une image PNG
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Tronquée pour l'exemple
    // Convertir la chaîne base64 en données binaires
    const imageBuffer = Buffer.from(base64Image, 'base64');
    // Chemin où l'image sera stockée
    const outputPath = '../my-react-app/public/employees/employee_' + id + '.png';
    // Écrire le fichier sur le disque
    fs.writeFile(outputPath, imageBuffer, (err) => {
        if (err) {
            console.error('Erreur lors de la sauvegarde de l\'image :', err);
        } else {
            console.log('Image sauvegardée avec succès à', outputPath);
        }
    });
};

const stockEmployeeImage = async (id) => {
    const fs = require('fs');
    const path = "../my-react-app/public/employees/employee_" + id + ".png";

    try {
        // Perform the Axios request to get the image URL
        const response = await axios.get(`https://soul-connection.fr/api/employees/${id}/image`, {
            ...config,
            responseType: 'arraybuffer'  // Ensure the response is a buffer for image data
        });

        // Write the image data to the specified path
        fs.writeFile(path, response.data, (err) => {
            if (err) {
                console.error('Erreur lors de la sauvegarde de l\'image :', err);
            } else {
                console.log('Image téléchargée et sauvegardée avec succès à', path);
            }
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error.message);
    }
};

const createCustomerPngFile = (id) => {
    const fs = require('fs');
    // Exemple de chaîne base64 représentant une image PNG
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Tronquée pour l'exemple
    // Convertir la chaîne base64 en données binaires
    const imageBuffer = Buffer.from(base64Image, 'base64');
    // Chemin où l'image sera stockée
    const outputPath = '../my-react-app/public/customers/customer_' + id + '.png';
    // Écrire le fichier sur le disque
    fs.writeFile(outputPath, imageBuffer, (err) => {
        if (err) {
            console.error('Erreur lors de la sauvegarde de l\'image :', err);
        } else {
            console.log('Image sauvegardée avec succès à', outputPath);
        }
    });
};

const stockCustomerImage = async (id) => {
    const fs = require('fs');
    const path = "../my-react-app/public/customers/customer_" + id + ".png";

    try {
        // Perform the Axios request to get the image URL
        const response = await axios.get(`https://soul-connection.fr/api/customers/${id}/image`, {
            ...config,
            responseType: 'arraybuffer'  // Ensure the response is a buffer for image data
        });

        // Write the image data to the specified path
        fs.writeFile(path, response.data, (err) => {
            if (err) {
                console.error('Erreur lors de la sauvegarde de l\'image :', err);
            } else {
                console.log('Image téléchargée et sauvegardée avec succès à', path);
            }
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error.message);
    }
};

const createClothesPngFile = (id) => {
    const fs = require('fs');
    // Exemple de chaîne base64 représentant une image PNG
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAUA...'; // Tronquée pour l'exemple
    // Convertir la chaîne base64 en données binaires
    const imageBuffer = Buffer.from(base64Image, 'base64');
    // Chemin où l'image sera stockée
    const outputPath = '../my-react-app/public/clothes/clothe_' + id + '.png';
    // Écrire le fichier sur le disque
    fs.writeFile(outputPath, imageBuffer, (err) => {
        if (err) {
            console.error('Erreur lors de la sauvegarde de l\'image :', err);
        } else {
            console.log('Image sauvegardée avec succès à', outputPath);
        }
    });
    stockClothesImage(id);
};

const stockClothesImage = async (id) => {
    const fs = require('fs');
    const path = "../my-react-app/public/clothes/clothe_" + id + ".png";

    try {
        // Perform the Axios request to get the image URL
        const response = await axios.get(`https://soul-connection.fr/api/clothes/${id}/image`, {
            ...config,
            responseType: 'arraybuffer'  // Ensure the response is a buffer for image data
        });

        // Write the image data to the specified path
        fs.writeFile(path, response.data, (err) => {
            if (err) {
                console.error('Erreur lors de la sauvegarde de l\'image :', err);
            } else {
                console.log('Image téléchargée et sauvegardée avec succès à', path);
            }
        });
    } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error.message);
    }
};

////////////////////////////////////////////////////////////////// CONTRONLLERS ////////////////////////////////////////////////////////////////////////////


// Get all tips
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

// Get all customers
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

// Get customer by ID
app.get('/api/customers/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Customers WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": row
      });
    });
  });

//Get all Events ||| GET METHOD
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM Events', [], (err, rows) => {
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

// Get all Users with work = Coach
app.get('/api/users', (req, res) => {
    db.all("SELECT * FROM Users WHERE work = 'Coach'", [], (err, rows) => {
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

// Get User by ID
app.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM Users WHERE id = ?', [id], (err, row) => {
      if (err) {
        res.status(400).json({"error": err.message});
        return;
      }
      res.json({
        "message": "success",
        "data": row
      });
    });
  });

// Give all encounters with customer_id
app.get('/api/encounters/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;
    db.all('SELECT * FROM Encounters WHERE customer_id = ?', [customer_id], (err, rows) => {
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

// Give number of encounters with a rating >= 3 with customer_id
app.get('/api/encounters/rating/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;
    db.all('SELECT * FROM Encounters WHERE customer_id = ? AND rating >= 3', [customer_id], (err, rows) => {
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

// Give number of encounters with a date > "now" with customer_id
app.get('/api/encounters/not-pass/:customer_id', (req, res) => {
    const customer_id = req.params.customer_id;
    db.all('SELECT * FROM Encounters WHERE customer_id = ? AND date > DATE("now")', [customer_id], (err, rows) => {
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

// Get all clothes
app.get('/api/customers/:id/clothes/hat-cap', (req, res) => {
    const customerId = req.params.id;

    // Requête SQL pour sélectionner les vêtements liés à un client spécifique
    const sql = "SELECT * FROM Clothes WHERE customer_id = ? and type = 'hat/cap'";

    db.all(sql, [customerId], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      // Envoi de la réponse avec les vêtements trouvés
      res.json({
        "message": "success",
        "data": rows
      });
    });
});

app.get('/api/customers/:id/clothes/bottom', (req, res) => {
    const customerId = req.params.id;

    // Requête SQL pour sélectionner les vêtements liés à un client spécifique
    const sql = "SELECT * FROM Clothes WHERE customer_id = ? and type = 'bottom'";

    db.all(sql, [customerId], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      // Envoi de la réponse avec les vêtements trouvés
      res.json({
        "message": "success",
        "data": rows
      });
    });
});

app.get('/api/customers/:id/clothes/top', (req, res) => {
    const customerId = req.params.id;

    // Requête SQL pour sélectionner les vêtements liés à un client spécifique
    const sql = "SELECT * FROM Clothes WHERE customer_id = ? and type = 'top'";

    db.all(sql, [customerId], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      // Envoi de la réponse avec les vêtements trouvés
      res.json({
        "message": "success",
        "data": rows
      });
    });
});

app.get('/api/customers/:id/clothes/shoes', (req, res) => {
    const customerId = req.params.id;

    // Requête SQL pour sélectionner les vêtements liés à un client spécifique
    const sql = "SELECT * FROM Clothes WHERE customer_id = ? and type = 'shoes'";

    db.all(sql, [customerId], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      // Envoi de la réponse avec les vêtements trouvés
      res.json({
        "message": "success",
        "data": rows
      });
    });
});


// Add new customer || POST METHOD
app.post('/api/addCustomer', (req, res) => {
    const { email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address } = req.body;

    const stmt = db.prepare('INSERT INTO Customers (email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address, function(err) {
        if (err) {
            console.error("Erreur lors de l'ajout du client:", err);
            return res.status(500).send("Erreur lors de l'ajout du client");
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Add new coach || POST METHOD
app.post('/api/addCoach', (req, res) => {
    const { email, name, surname, birth_date, gender, work } = req.body;

    const stmt = db.prepare('INSERT INTO Users (email, name, surname, birth_date, gender, work) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(email, name, surname, birth_date, gender, work, function(err) {
        if (err) {
            console.error("Erreur lors de l'ajout du coach:", err);
            return res.status(500).send("Erreur lors de l'ajout du coach");
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Add new user || POST METHOD
app.post('/api/addUser', (req, res) => {
    const { email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address } = req.body;

    const stmt = db.prepare('INSERT INTO Users (email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(email, name, surname, birth_date, gender, description, astrological_sign, phone_number, address, function(err) {
        if (err) {
            console.error("Erreur lors de l'ajout de l'utilisateur:", err);
            return res.status(500).send("Erreur lors de l'ajout de l'utilisateur");
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Add coach_id to customer || PUT METHOD
app.put('/api/addCoachToCustomer/:id', (req, res) => {
    const customer_id = req.params.id;
    const { coach_id } = req.body;

    const stmt = db.prepare('UPDATE Customers SET coach_id = ? WHERE id = ?');
    stmt.run(coach_id, customer_id, function(err) {
        if (err) {
            console.error("Erreur lors de l'ajout du coach au client:", err);
            return res.status(500).send("Erreur lors de l'ajout du coach au client");
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Get Coach by ID || GET METHOD
app.get('/api/coaches/:id', (req, res) => {
    const id = req.params.id;

    db.get('SELECT * FROM Users WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }
        res.json({
            "message": "success",
            "data": row
        });
    });
});

//Get All Encounters || GET METHOD
app.get('/api/encounters', (req, res) => {
    db.all('SELECT * FROM Encounters', (err, rows) => {
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

// Get Customer by Coach_id || GET METHOD
app.get('/api/customersByCoach/:id', (req, res) => {
    const coach_id = req.params.id;

    db.all('SELECT * FROM Customers WHERE coach_id = ?', [coach_id], (err, rows) => {
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

app.put('/api/customersEdit/:id', async (req, res) => {
    const customerId = req.params.id;
    const customerData = req.body; // Contient les informations du client
  
    try {
      // Mise à jour du client dans la base de données
      await db.query('UPDATE customers SET ? WHERE id = ?', [customerData, customerId]);
      res.status(200).send({ message: 'Client mis à jour avec succès' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client', error);
      res.status(500).send({ message: 'Erreur serveur' });
    }
  });
  

// Delete customer || DELETE METHOD
app.delete('/api/deleteCustomer/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM Customers WHERE id = ?', [id], function(err) {
        if (err) {
            console.error("Erreur lors de la suppression du client:", err);
            return res.status(500).send("Erreur lors de la suppression du client");
        }
        res.status(200).send({ id: this.lastID });
    });
});

// Delete user || DELETE METHOD
app.delete('/api/deleteUser/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM Users WHERE id = ?', [id], function(err) {
        if (err) {
            console.error("Erreur lors de la suppression de l'utilisateur:", err);
            return res.status(500).send("Erreur lors de la suppression de l'utilisateur");
        }
        res.status(200).send({ id: this.lastID });
    });
});

//Exécution des fonctions
const populateData = async () => {
    await getAllEmployees();
    await getAllCustomers();
    await getAllEncouters();
    await getAllEvents();
    await fetchAndInsertTips();
    await processAllCustomers();
    console.log("Les données ont été importées avec succès.");
}

populateData();

// Démarrer le serveur Express
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
