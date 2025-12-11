-- Base de données SchoolBus Pro

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cin VARCHAR(20) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('tuteur', 'responsable', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des élèves
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    classe VARCHAR(50),
    ecole VARCHAR(255),
    tuteur_id INT,
    bus_id INT,
    transport_type ENUM('annuel', 'mensuel', 'matin', 'soir') DEFAULT 'annuel',
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuteur_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table des chauffeurs
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cin VARCHAR(20) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    permis VARCHAR(50),
    bus_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des bus
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(20) UNIQUE NOT NULL,
    capacite INT DEFAULT 30,
    immatriculation VARCHAR(50),
    driver_id INT,
    responsable_id INT,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    FOREIGN KEY (responsable_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des trajets
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    bus_id INT,
    type ENUM('matin', 'soir') NOT NULL,
    heure_depart TIME,
    heure_arrivee TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- Table des arrêts
CREATE TABLE IF NOT EXISTS stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    nom VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    ordre INT,
    heure_prevue TIME,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- Table des positions GPS
CREATE TABLE IF NOT EXISTS gps_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    vitesse DECIMAL(5, 2),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    responsable_id INT,
    tuteur_id INT,
    student_id INT,
    type ENUM('monte', 'descendu', 'arrive', 'retard', 'autre'),
    message TEXT,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (responsable_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (tuteur_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Table de l'historique
CREATE TABLE IF NOT EXISTS history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    bus_id INT,
    type VARCHAR(50),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- Insertion de données de test
INSERT INTO users (nom, prenom, cin, telephone, email, password, user_type) VALUES
('Admin', 'System', 'AD000000', '0612000000', 'admin@schoolbus.com', 'admin123', 'admin'),
('Alami', 'Mohammed', 'CH123456', '0612345678', 'alami@email.com', 'pass123', 'responsable'),
('Bennani', 'Ahmed', 'TU123456', '0623456789', 'bennani@email.com', 'pass123', 'tuteur');

INSERT INTO buses (numero, capacite, immatriculation, status) VALUES
('12', 30, '12345-A-67', 'active'),
('8', 25, '23456-B-78', 'active'),
('15', 28, '34567-C-89', 'active');

INSERT INTO drivers (nom, prenom, cin, telephone, permis) VALUES
('Alami', 'Mohammed', 'DR123456', '0612345678', 'B'),
('Bennani', 'Hassan', 'DR234567', '0623456789', 'B'),
('Idrissi', 'Karim', 'DR345678', '0634567890', 'B');
