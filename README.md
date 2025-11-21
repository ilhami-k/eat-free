# Eat Free - Application de Gestion Nutritionnelle

Application de bureau développée avec Electron, Vue 3 et MySQL pour gérer vos recettes, inventaire d'ingrédients, planification de repas et suivi nutritionnel quotidien.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger](https://nodejs.org/)
- **MySQL** (version 8.0 ou supérieure) - [Télécharger](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Télécharger](https://git-scm.com/)

## 🚀 Installation et Configuration

### 1. Cloner le Projet

```bash
git clone https://github.com/ilhami-k/eat-free.git
cd eat-free
```

### 2. Configuration de la Base de Données MySQL

#### a) Démarrer le serveur MySQL

Assurez-vous que votre serveur MySQL est en cours d'exécution.

#### b) Créer la base de données

Ouvrez un terminal MySQL et exécutez :

```sql
CREATE DATABASE eat_free;
```

#### c) Exécuter les scripts SQL

Dans l'ordre suivant, exécutez les scripts situés dans le dossier `database/` :

**Option 1 : Via ligne de commande**

```bash
# Depuis la racine du projet
mysql -u root -p eat_free < database/schema.sql
mysql -u root -p eat_free < database/routines.sql
mysql -u root -p eat_free < database/seeding.sql
```

**Option 2 : Via un client graphique (MySQL Workbench, DBeaver, etc.)**

Ouvrez chaque fichier dans l'ordre et exécutez-les :
1. `database/schema.sql` - Crée les tables et contraintes
2. `database/routines.sql` - Crée les procédures stockées et triggers
3. `database/seeding.sql` - Insère les données de test

### 3. Installation des Dépendances Frontend

```bash
cd front-end
npm install
```

### 4. Configuration de Prisma

#### a) Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `front-end/` :

```env
DATABASE_URL="mysql://root:root@localhost:3306/eat_free"
```

**Remplacez :**
- `root:root` par vos identifiants MySQL (utilisateur:mot_de_passe)
- `localhost:3306` si votre serveur utilise un autre hôte/port

#### b) Générer le client Prisma

```bash
npx prisma generate
```

Cette commande génère le client Prisma TypeScript basé sur votre schéma de base de données.

### 5. Lancer l'Application

```bash
npm start
```

L'application devrait se lancer automatiquement. Si c'est la première utilisation, vous verrez un écran d'accueil pour créer ou sélectionner un utilisateur.

## 🏗️ Structure du Projet

```
eat-free/
├── database/                 # Scripts SQL
│   ├── schema.sql           # Définition des tables
│   ├── routines.sql         # Procédures stockées et triggers
│   └── seeding.sql          # Données de test
│
├── front-end/               # Application Electron
│   ├── src/
│   │   ├── main/           # Processus principal Electron
│   │   │   └── repositories/  # Accès base de données (Prisma)
│   │   ├── preload/        # Script preload (IPC bridge)
│   │   ├── renderer/       # Interface utilisateur (Vue 3)
│   │   │   ├── components/
│   │   │   ├── composables/
│   │   │   └── pages/
│   │   └── shared/         # Types partagés
│   │
│   ├── prisma/
│   │   └── schema.prisma   # Schéma Prisma
│   │
│   ├── package.json
│   └── .env                # Configuration (à créer)
```

## 🎯 Fonctionnalités Principales

1. **Dashboard** - Vue d'ensemble avec statistiques
2. **Inventaire** - Gestion des ingrédients en stock
3. **Recettes** - Création et consultation de recettes avec informations nutritionnelles
4. **Planification de Repas** - Organisation hebdomadaire des repas
5. **Journal** - Suivi quotidien de l'apport calorique

## 📝 Données de Test

Le script `seeding.sql` crée automatiquement :
- Un utilisateur de test : **Gordon R.**
- 15 recettes variées avec informations nutritionnelles complètes
- Plus de 200 ingrédients avec valeurs nutritionnelles
- Un inventaire pré-rempli avec 55+ ingrédients

## 🛠️ Commandes Utiles

### Développement

```bash
cd front-end

# Lancer en mode développement
npm start

# Régénérer le client Prisma après modification du schéma
npx prisma generate

# Voir la base de données dans Prisma Studio
npx prisma studio
```

### Base de Données

```bash
# Se connecter à MySQL
mysql -u root -p

# Utiliser la base de données
USE eat_free;

# Voir toutes les tables
SHOW TABLES;

# Réinitialiser la base de données (supprime toutes les données)
DROP DATABASE eat_free;
CREATE DATABASE eat_free;
# Puis réexécuter les scripts SQL
```

## ⚠️ Problèmes Courants

### Erreur de connexion Prisma

Si vous obtenez une erreur `Can't reach database server`:
- Vérifiez que MySQL est en cours d'exécution
- Vérifiez vos identifiants dans le fichier `.env`
- Testez la connexion : `mysql -u root -p`

### Erreur "Table doesn't exist"

Les scripts SQL n'ont pas été exécutés dans le bon ordre ou pas du tout :
```bash
mysql -u root -p eat_free < database/schema.sql
mysql -u root -p eat_free < database/routines.sql
mysql -u root -p eat_free < database/seeding.sql
```

### L'application ne démarre pas

```bash
cd front-end
rm -rf node_modules package-lock.json
npm install
npx prisma generate
npm start
```

### Erreur Prisma "Environment variable not found"

Créez le fichier `.env` dans `front-end/` avec :
```env
DATABASE_URL="mysql://root:root@localhost:3306/eat_free"
```

## 🙋 Auteur

Ilhami K. - Projet de gestion nutritionnelle


