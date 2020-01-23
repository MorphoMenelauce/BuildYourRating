#!/usr/bin/env node

const argv = require('yargs') // Analyse des paramètres
  .command('get <key>', 'Récupère la valeur associé à la clé')
  .command('set <key> <value>', 'Place une association clé / valeur')
  .command('keys', 'Demande la liste des clés')
  .demandCommand(1, 'Vous devez indiquer une commande')
  .help()
  .argv;

const URL = argv.url || "http://localhost:3000"; // Utilisation de l'url en paramètre ou par defaut localhost:3000

const io = require('socket.io-client');

const socket = io(URL, {
  path: '/byr',
});

socket.on('connect', () => {
  console.info('Connection établie');

  switch (argv._[0]) {
    case 'get':
      socket.emit('get', argv.key, (value) => {
        console.info(`get ${argv.key} : ${value}`);
        socket.close();
      });
      break;
    case 'set':
      socket.emit('set', argv.key, argv.value, (ok) => {
        console.info(`set ${argv.key} : ${ok}`);
        socket.close();
      });
      break;
    case 'keys':
      console.error("J'ai oublié celle-là '-_-'");
      break;
    default:
      console.error("Commande inconnue");
      socket.close();
  }
});
