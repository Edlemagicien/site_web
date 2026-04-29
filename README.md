voici mon site web sur le theme de la magie
#Site javascript/css/html

Site personnel d'**Edgar**, magicien close-up spécialisé en magie de cartes.  
Construit avec [Hugo](https://gohugo.io/) et le thème [Blowfish](https://blowfish.page/).

---

## Stack technique

- **Hugo** v0.152.2 (extended)
- **Blowfish** v2.103.0
- **Langues** — Français (par défaut) / Anglais
- **Hébergement** — Statique (compatible Netlify / GitHub Pages)

---

## Structure du projet

```
mon-site-magie/
├── assets/
│   └── css/
│       └── custom.css          # Couleurs et styles personnalisés
├── content/
│   ├── fr/                     # Contenu français (langue par défaut)
│   │   ├── _index.md           # Page d'accueil
│   │   ├── about.md            # À Propos
│   │   ├── prestations.md      # Prestations
│   │   └── contact.md          # Contact
│   └── en/                     # Contenu anglais
│       ├── _index.md
│       ├── about.md
│       ├── prestations.md
│       └── contact.md
├── layouts/
│   ├── _default/
│   │   ├── baseof.html
│   │   ├── home.html
│   │   ├── single.html
│   │   └── section.html
│   ├── partials/
│   │   ├── header.html         # Header personnalisé (logo + nav + toggle thème)
│   │   ├── footer.html         # Footer personnalisé (contacts + réseaux)
│   │   └── extend-head.html    # Injection du CSS
│   └── shortcodes/
│       └── avis.html           # Chargement du script du carousel de témoignages
├── static/
│   ├── images/
│   │   └── logo.png            # Logo ED Magie
│   └── js/
│       └── index.js            # Logique du carousel de témoignages
├── themes/
│   └── blowfish/               # Thème (git submodule)
├── hugo.toml                   # Configuration principale Hugo
└── README.md
```

---

## Démarrage rapide

### Prérequis

- Hugo Extended v0.140+ 
- Git

### Installation

```bash
git clone https://github.com/TON_USERNAME/mon-site-magie.git
cd mon-site-magie
git submodule update --init --recursive
hugo server
```

Ouvrir [caroute.free.fr](caroute.free.fr)

---

## Configuration

Tous les réglages du site sont dans `hugo.toml` à la racine du projet.

### Paramètres importants

```toml
baseURL = 'https://magicien.org/'
defaultContentLanguage = "fr"
theme = "blowfish"

[markup.goldmark.renderer]
  unsafe = true        # Nécessaire pour afficher le HTML brut dans les fichiers markdown
```

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

Ouvrir `static/js/index.js` et ajouter une entrée dans le tableau `DATA` :

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
## Déploiement

### Build

```bash
hugo --gc --minify
```

Le résultat est dans `public/` mais comme expliquer dans le mail la compilation n'est pas 100% operationnel seul la page principal fonctionnel
# 🎩 ED Magie

Site web personnel d'Edgar, magicien close-up spécialisé en magie de cartes et en close-up. Le site présente ses prestations, son parcours et permet aux clients de le contacter pour réserver une animation lors de leurs événements (mariages, soirées d'entreprise, fêtes privées).

---

## Fonctionnalités

- **Page d'accueil** avec hero animé, cartes flottantes et effet typewriter
- **Compteurs animés** (événements, années d'expérience, satisfaction)
- **Carousel de témoignages** interactif avec cartes à jouer zoom au clic, particules, défilement infini, parametrage de la carte en cliquant dessus sur le header on peut en choisir une parmis les 52 existante
- **Page Prestations** détaillant les 4 formules disponibles
- **Page À Propos** avec photo et biographie
- **Page Contact** avec formulaire javascript comme le site est statique quand on clique sur envoyer par mail ou sms ce
- **Mode sombre / clair** avec bascule automatique et mémorisation
- **Site bilingue** français / anglais
- **Design responsive** adapté mobile et desktop
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



Le site généré se trouve dans le dossier `public/` il suffit de déployer ce dossier sur n'importe quel hébergeur statique mais comme expliquer dans mon message sur teams la compilation ne marche pas
