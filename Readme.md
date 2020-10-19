# Build Your Rating

## Objectif

Les buts de cette étape sont :

* Mettre en place un algorithme de consensus pour notre base de données.
* Introduire les notions de *blockchain*.

## Consensus

À l'étape précédente, nous avons mis en place un système distribué minimal mais qui fonctionne plus ou moins bien car il n'a pas d'algorithme de consensus. Un algorithme de consensus est un algorithme qui va permettre aux noeuds de se mettre d'accord sur une valeur. Par exemple, si deux valeurs différentes sont proposées pour une même clé, l'algorithme doit permettre d'en choisir une. Il existe de nombreux algorithme de consensus, nous verrons ici un algorithme adapté aux *blockchains* et utilisant la preuve de travail.

## Preuve de travail

La preuve de travail n'est pas un algorithme de consensus. C'est la preuve d'un travail réalisé. Elle est couteuse à produire mais facile à vérifier, c.-à-d., que l'utilisateur va devoir dépenser des ressources en temps et en énergie pour la produire mais il va être beaucoup plus simple de la vérifier. Elle est utilisée dans de nombreuses conditions. Par exemple, dans l'envoie de mail pour limiter les spams en augmentant le coût d'envoie d'un mail.

Pour réaliser une preuve de travail, il faut savoir sur quoi on veut mettre une preuve. À l'étape précédente, ce qui nous pose problème c'est l'ajout d'une valeur, mettons une preuve dessus ! On veut donc mettre une preuve sur le couple key / valeur. Par exemple : `Enseignant / Damien Reimert`.

On va ensuite utiliser une fonction de hachage sur cette valeur pour obtenir une empreinte et on va mettre une condition sur cette empreinte. La preuve va consister à trouver un *nombre magique* qui permet à l'empreinte de respecter la condition.
Un des avantages est qu'il n'y a pas besoin de communiquer à l'avance avec l'interlocuteur pour lui fournir la preuve.

Erf, je parle de *nombres magiques* !? Promis, je n'ai rien pris. Je vais vous expliquer deux ou trois trucs avant de continuer.

### Le nombre magique

Je veux maintenant imposer une condition au hash, par exemple, il doit commencer par un zéro. Mais je suis incapable de connaitre le résultat de la fonction de hachage et dans l'exemple, le hash ne commence pas par zéro. Je fais comment ?

C'est ici qu'intervient le *nombre magique*. On a vu qu'une petite modification entraine un changement important de l'empreinte. On va donc rajouter un nombre à la valeur sur laquelle on veut mettre notre preuve.

```Bash
> echo "Enseignant / Damien Reimert / 0" | shasum
# cf3ee12420c29fbf13aff6d3397561735284366d  -
```

Il n'y a toujours pas de zéro au début mais nous allons pouvoir incrémenter ce nombre.

#### Incrémenter le nombre jusqu'à obtenir une signature commençant par zero.

Vous venez de faire une preuve de travail et le nombre trouvé est le *nombre magique*.

## Implémentation

Pour calculer une empreinte :

```Javascript
const crypto = require('crypto');

const getHash = function getHash() {
  const unMotDoux = "Votre mot doux";
  return crypto.createHash('sha256').update(unMotDoux, 'utf8').digest('hex');
}
```

Pour concaténer plusieurs valeurs :

```Javascript
const toHash = `${key}${valeur}${magicNumber}`;
```

#### Modifiez le serveur pour qu'il vérifie que l'empreinte commence bien par un zero.

#### Modifiez le client pour qu'il cherche automatiquement le *nombre magique* avant d'envoyer la requête.

Mais en faites, ça ne règle pas notre problème car la preuve de travail en elle-même n'est pas un algorithme de consensus. Nous avons juste ralenti l'écriture dans la base de données. Et si vous augmenter le nombre de zéro demandé en début de d'empreinte, vous pouvez encore plus ralentir cette écriture mais on y reviendra.

Comme on l'a vu à l'étape précédente, on ne peut pas faire confiance à l'horodatage fournis par nos utilisateurs. Il faudrait une horloge globale au système. C'est le problème que l'on résout avec une chaine de blocks !

## Blockchain

Dans le monde réel, les machines tombent en panne, il y a des problèmes de latence réseau et des personnes mal attentionnées mais je veux toujours faire une base de données sans tiers de confiance. Une des solutions est de mettre en place une *blockchain*.

Une *blockchain* simple est une **base de données distribuée**, sur laquelle on ne peut faire que **deux opérations** : **lire** et **ajouter un block en fin de chaîne**. Ajouter un block demande une **preuve**. L'**algorithme de consensus** est le suivant : on garde la chaîne la plus longue.

Ça vous dit quelque-chose ? Il ne nous manque que la notion de block et de chaîne.

Un block est un ensemble d'informations. Dans notre cas, nous allons y mettre : Une clé, une valeur, le *nombre magique* mais que j'appellerai maintenant *nonce* ou bruit, l'empreinte du block que j'appellerai son *id*. C'est les mêmes informations que nous avons manipulés jusque là.

Pour constituer une chaîne, il faut rajouter : l'id du block précédent. Et pour des raisons pratique, nous allons aussi mettre l'index du block dans la chaîne.

Un block ressemble à ça :

     Block
    +-----------------------+
    |                       |
    | index: <index>        |
    | id: <example: 42>     |
    | previous: <idPrev>    |
    | key: <votre clé>      |
    | value: <votre valeur> |
    | nonce: <magicNumber>  |
    |                       |
    +-----------------------+

On va rajouter quelques contraintes sur l'empreinte :

* On calcule l'empreinte sur la clé, la valeur, le nonce, l'id du block précédent et l'index.
* L'empreinte doit commencer par un zero.

Et je vais pouvoir enchainer les blocks.

    Block N                            Block N+1
    +-----------------------+          +-----------------------+
    |                       |          |                       |
    | index: 23             |          | index: 24             |
    | id: '06819d...'       |<--+      | id: '0ad5243...'      |
    | previous: '032983...' |   +------| previous: '06819d...' |
    | key: "Bonjour"        |          | key: 'Hello'          |
    | value: "World"        |          | value: 'Monde'        |
    | nonce: 8              |          | nonce: 6              |
    |                       |          |                       |
    +-----------------------+          +-----------------------+

Le premier block est particulier, il n'a pas de prédécesseur. On l'appelle le *block genesis*. Il doit être le même pour tous sinon il sera impossible de construire une blockchain commune.

## Implémentation

Histoire de ne pas tout mélanger, mettons de coté le code réalisé jusque là. Vous avez tous les outils pour réaliser l'implémentation d'un block. Pour vous aider, j'ai commencé l'implémentation d'un block dans le fichier `Block.js`. J'ai aussi ajouter un fichier `etape-4-1.js`.

#### Modifiez le fichier `Block.js` pour finir l'implémentation de la class `Block`.

##### Indice. Pour accéder au aux attributs d'une intense de classe depuis une méthode :

```Javascript
class MaClass {

  constructor() {
    this.monAttribut = "maValeur";
  }

  // Retourne l'identifiant du block en le calculant depuis les données
  maMethode() {
    const texte = `La valeur de 'monAttribut' est ${this.monAttribut}`;
    return texte;
  }
}
```

#### Pour simplifier le travail de votre client, ajoutez la commande `last` à la base de données qui renvoie le dernier block de la chaîne.

Vous avez maintenant une chaîne de blocks. On ne peut plus modifier les enregistrements passées mais on n'a toujours pas d'algorithme de consensus.

#### Que se passe-t'il si un noeud se désynchronise ?

## Synchronisation

Maintenant que l'on a une mécanique de blockchain, il n'y a pas de raisons que nous noeuds se synchronise à l'aide de la commande `keys`.

#### Implémentez une commande `block` qui retourne le block d'`id` fournie.

#### Quand un noeud se lance, il se connecte aux autres noeuds et demande le dernier block. Puis il reconstitue la chaine.


## Conclusion

Vous avez maintenant une blockchain minimale !

## Suite

Aller à l'étape 5 : `git checkout etape-5`.

Pour continuer à lire le sujet :

* soit vous lisez le fichier `README.md` sur votre machine.
* soit sur GitHub, au-dessus de la liste des fichiers, vous pouvez cliquer sur `Branch: master` et sélectionner `etape-5`.
