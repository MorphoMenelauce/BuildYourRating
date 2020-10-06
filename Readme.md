# Build Your Rating

## Objectif

Les buts de cette étape sont :

* Transformer notre base de données client / serveur en une base distribuée.
* Comprendre les problèmes liés aux systèmes distribués.

## Confiance et défaillance

Dans l'approche par client / serveur, vous devez avoir confiance dans le serveur :

* Il ne va pas altérer les données : les perdre ou les corrompre.
* Il va être disponible pour vous répondre : accepter de vous répondre, être actif et ne pas subir une panne.

Vous devez avoir confiance dans le fait que l'individu ou l'entité qui opère le serveur respecte ces critères. Mais face à des enjeux économiques ou politiques importants, il se peut qu'on ne puisse pas faire confiance à une seule entité.

Pour résister aux pannes ou à une forte demande vous pouvez aussi avoir envie de mettre plusieurs serveurs, chacun pouvant absorber une partie de la charge.

La solution utilisée par la blockchain est la distribution. Il n'y a pas de serveur central, tout le monde peut se rajouter au réseau et assurer le rôle de serveur. C'est une base de données distribuées. Distribuer revient à avoir plusieurs serveurs qui se synchronisent entre eux. Il n'y a plus besoin d'avoir confiance dans un unique individu mais il faut faire confiance à l'ensemble du système donc à de multiple individus.

#### Essayer de lancer plusieurs fois le serveur. Que ce passe-t'il ? Pourquoi ?

Mettre plusieurs serveurs sur une même machine n'est pas une idée de génie. En production, l'utilité est assez limité mais en test ou en développement, c'est fort utile à moins de disposer de plusieurs machines.

Il faut pouvoir lancer le serveur plusieurs fois avec des configurations différentes.

#### Observer le code source de `db.js`. Lancez plusieurs serveurs en parallèle sans modifier le code source.

Vous êtes maintenant en mesure de lancer plusieurs serveurs en parallèle mais ils ne se voient pas et ne se synchronisent pas.

## Appariement et synchronisation

Il faut maintenant faire en sorte que nos serveurs se voient et se parlent. Pour cela, il faut savoir comment les contacter.

Vous allez essayer de mettre en place 3 serveurs qui communiquent entre eux et se synchronisent. Dans un premier temps, on va le mettre en dur dans le code source. Par exemple, supposons que vous utilisez les ports 3000, 4000 et 5000. Vous pouvez ajouter le code suivant pour calculer automatiquement vos voisins :

```Javascript
const ports = [3000, 4000, 5000];
const others = [3000, 4000, 5000].filter((p) => {return p !== PORT});
```

#### Au lancement du serveur, connectez-vous aux autres pairs et construisez un tableau de sockets.

##### Indice 1 :

```Javascript
// Pour produire un nouveau tableau à partir d'un tableau
const monTableauInitial = ['a', 'b', 'c', 'd'];
const nouveauTableau = monTableauInitial.map((element, index) => {
    // mon traitement pour chaque element
    // ...
    return element.repeat(index);
});
console.log(nouveauTableau); // ["", "b", "cc", 'ddd']
```

##### Indice 2 : Pour se connecter à un autre serveur, il suffit de faire comme le client.

Votre serveur est connecté aux autres. Il faut maintenant mettre à jour les autres quand lui-même est modifié.

#### Modifiez la méthode `set` pour qu'elle mette à jour les autres pairs.

##### Indice :
```Javascript
// Un tableau remplit de choses
const monTableau = ['a', 'b', 'c', 'd'];
monTableau.forEach((element, index) => {
    // Je peux faire quelque-chose pour chaque élément.
    console.log("L'élément d'index", index, "est", element);
});
```

#### Utilisez le *CLI* pour vérifier que tous les serveurs sont dans le même état. Si vous ne voyez pas comment, regardez le code source.

Vous avez réussi ? `set` une valeur sur un des serveurs met automatiquement à jour les autres ? Cool !

Imaginez trois amis qui essayent de maintenir une connaissance commune du statut relationnel de leurs connaissances. Réfléchissez maintenant à tous les problèmes qui peuvent arriver. Que ce passe-t'il si un des amis est malade ou n'a plus de connexion réseau ? Si deux amis reçoivent en même temps des informations différentes pour une même personne ? Combien de temps avant de se synchroniser ?

Nous verrons comment résoudre ces difficultés à l'étape suivant.

## Jouer avec des inconnus

Dans Bitcoin et dans un système distribué plus généralement, on peut ajouter un noeud à tout moment et sans le connaitre.

#### Mettez en commentaire la liste des ports que vous avez ajoutez à la section précédente.
#### Ajoutez une commande `addPeer` à votre serveur et au *cli*. Cette commande prend en paramètre l'adresse d'un autre serveur et demande au serveur de se connecter à cette adresse et de transmettre les mises à jour, comme les serveurs qui étaient en "dur".

Lancer deux serveurs, ajouter l'un à l'autre et ajouter une valeur au premier.

#### La valeur est-elle bien propagée ?

Ajouter une autre valeur à l'autre.

#### La valeur est-elle bien propagée ?

## Synchronisation initiale

Lancer un troisième serveur. Ajouter ce serveur aux deux autres et ajouter les deux autres au nouveau.

#### Demander une valeur définie précédemment au troisième serveur. Quel est le problème ?

Modifier le code pour qu'à l'ajout d'un autre serveur, une requête `keys` soit envoyée et les clés inconnues ajoutées.

## Partager ses voisins (bonus)

Ajouter les voisins à chaque serveur et à chaque fois que vous relancez les serveurs est assez pénible ? Il suffit de faire la même chose qu'avec les clés. Quand vous ajoutez un pair, donnez l'informations aux autres pairs et permettez à un nouvel arrivant de récupérer la liste des pairs d'un serveur. Par exemple avec une commande `peers`. Vous n'aurez plus qu'à ajouter chaque pair qu'une fois.

Ou si vous avez la flemme / êtes en retard, mettez en dur cette liste.

## Conclusion

Nous avons un système qui marche plus ou moins, dans lequel n'importe quel noeud peut se connecter et reconstruire la base de données. C'est un système distribué minimaliste mais il ne fonctionne que dans un monde idéal où il n'y a pas de pannes ni de personnes mal intentionnées.

## Suite

Aller à l'étape 3 : `git checkout etape-3`.

Pour continuer à lire le sujet :

* soit vous lisez le fichier `README.md` sur votre machine.
* soit sur GitHub, au-dessus de la liste des fichiers, vous pouvez cliquer sur `Branch: master` et sélectionner `etape-3`.

## Pour aller plus loin

Pour continuer cette étape, vous pouvez essayer de discuter avec vos camarades pour étendre le système entre plusieurs machines.

Vous pouvez mettre en place des backups sur disque de la base de données.
