voici mon site web sur le theme de la magie
#Site javascript/css/html
Site qui exprime mes talents de magicien close-up spécialisé en magie de cartes. Le site présente mes prestations, mon parcours rapidement et permet aux clients de me contacter pour réserver une animation lors de leurs événements (mariages, soirées d'entreprise, fêtes privées).
Construit avec [Hugo](https://gohugo.io/) et le thème [Blowfish](https://blowfish.page/).

---

## Stack technique

- **Hugo** v0.152.2 (extended)
- **Blowfish** v2.103.0
- **Langues** : Français (par défaut) / Anglais
- **Hébergement** : http://caroute.free.fr/
---
Ouvrir [caroute.free.fr](caroute.free.fr)

### Palette de couleurs (tirée du logo)

| Variable | Mode clair | Mode sombre |
|---|---|---|
| Fond | `#E8F6FD` | `#050D2E` |
| Texte | `#0D1B6E` | `#D0EEFF` |
| Accent | `#007FBF` | `#00CFFF` |
| Fond navigation | `#0D1B6E` | `#03061A` |
| Bordure | `#90CAE8` | `#00CFFF` |

---

## Ajouter du contenu

### Nouveau témoignage

Ouvrir `static/js/index.js` et ajouter une entrée dans le tableau `DATA` (les avis mis sur le site sont totalement factice):

```js
{
  rank: 'A',
  suit: '♠',
  red: false,
  stars: 5,
  quote: "Votre témoignage ici.",
  author: "Prénom N. — Contexte de l'événement"
}
```
## Fonctionnalités

- **Page d'accueil** avec hero animé, cartes flottantes et effet typewriter
- **Compteurs animés** (événements, années d'expérience, satisfaction)
- **Carousel de témoignages** interactif avec cartes à jouer zoom au clic, particules, défilement infini, parametrage de la carte en cliquant dessus sur le header on peut en choisir une parmis les 52 existante
- **Page Prestations** détaillant les 4 formules disponibles
- **Page À Propos** avec photo et biographie
- **Page Contact** avec formulaire javascript comme le site est statique quand on clique sur envoyer par mail ou sms cela ouvre un message prearranger pret à etre envoyé
- **Mode sombre / clair** avec bascule automatique et mémorisation
- **Site bilingue** français / anglais
- **Couleurs personnalisées** extraites de mon logo 

---

## Installation et exécution

### Prérequis

- Hugo
- Blowfish
- Git

### Étapes

**1. Cloner le dépôt**

**2. Initialiser le thème Blowfish**

**3. Lancer le serveur de développement**

```bash
hugo server
```

Ouvrir [http://localhost:1313](http://localhost:1313) dans le navigateur.



Le site généré se trouve dans le dossier `public/` mais comme expliquer dans mon message sur teams la compilation ne marche pas
