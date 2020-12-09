#!/usr/bin/env node

const argv = require('yargs').argv; // Analyse des paramètres

const PORT = argv.port; // Utilisation du port en paramètre ou par defaut 3000
var ports = [];
var others = ports.filter((p) => {
    return p !== PORT
});

const Server = require('socket.io');
const io_client = require('socket.io-client');

var connec_others = others.map((element, index) => {
    const socket = io_client(`http://localhost:${element}`, {
        path: '/byr',
    });
    return socket;
});

const io = new Server(PORT, { // Création du serveur
    path: '/byr',
    serveClient: false,
});

console.info(`Serveur lancé sur le port ${PORT}.`);

const db = Object.create(null); // Création de la DB

io.on('connect', (socket) => { // Pour chaque nouvlle connexion

    console.info('Nouvelle connexion');

    socket.on('get', function (field, callback) {
        console.info(`get ${field}: ${db[field]}`);
        callback(db[field]);
    });

    socket.on('set', function (field, value, callback) {
        if (field in db) {
            console.info(`set error : Field ${field} exists.`);
            callback(false);
        } else {
            console.info(`set ${field} : ${value}`);
            db[field] = value;
            connec_others.forEach((element, index) => {
                element.emit('set', field, value, (ok) => {
                    console.info(`set ${field} : ${ok}`);
                });
            });
            callback(true);
        }
    });

    socket.on('keys', function (callback) {
        console.info(`keys`);
        callback(Object.keys(db));
    });

    socket.on('addPeer', function (address, callback) {
        if (ports.includes(address)) {
            console.info(`addPeer error : server ${address} exists.`);
            callback(false);
        } else {
            ports.push(address);
            others = ports.filter((p) => {
                return p !== PORT
            });

            connec_others = others.map((element, index) => {
                const socket = io_client(`http://localhost:${element}`, {
                    path: '/byr',
                });
                return socket;
            });

            console.info(`add server ${address} in list`);
            console.info(`server list ${ports}`);
            callback(true);
        }
    });
});
