const Block = require("./Block");

const first  = new Block(0, null, "bienvenue", "Bienvenue à vous !");
first.miner();
const second = new Block(1, first.id, "miner", "La fonction miner cherche un id de block valide.");
second.miner();
const third  = new Block(2, second.id, "oubli", "Il ne faut donc pas oublier de l'appeler.");
third.miner();

console.log([first, second, third]);
