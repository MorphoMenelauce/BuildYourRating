#!/usr/bin/env node

const argv = require('yargs').argv; // Analyse des paramètres

const PORT = argv.port || 3000; // Utilisation du port en paramètre ou par defaut 3000

const Server = require('socket.io');
const io = new Server(PORT, { // Création du serveur
  path: '/byr',
  serveClient: false,
});

console.info(`Serveur lancé sur le port ${PORT}.`);

const db = Object.create(null); // Création de la DB

io.on('connect', (socket) => { // Pour chaque nouvlle connexion
  console.info('Nouvelle connexion');

  socket.on('get', function(field, callback){
    console.info(`get ${field}: ${db[field]}`);
    callback(db[field]);
  });

  socket.on('set', function(field, value, callback){
    if (field in db) {
      console.info(`set error : Field ${field} exists.`);
      callback(false);
    } else {
      console.info(`set ${field} : ${value}`);
      db[field] = value;
      callback(true);
    }
  });

  socket.on('keys', function(callback){
    console.info(`keys`);
    callback(Object.keys(db));
  });
});
