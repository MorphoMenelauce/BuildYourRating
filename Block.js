module.exports = class Block {

  // Complétez le constructeur
  constructor(index, previous, key, value, nonce = 0) {
    // Le mot clé `this` permet d'accèder aux propriétés de l'object depuis ses méthodes.
    this.index = index;
    this.previous = previous;
    this.key = key;
    this.value = value;
    this.nonce = nonce;

    this.id = this.getHash();
  }

  // Retourne l'identifiant du block en le calculant depuis les données
  getHash() {
    return "id";
  }

  // Retourne un boolean qui indique si le block est valide
  isValid() {
    return false;
  }

  // Permet de trouver une empreinte valide
  miner() {}
}
