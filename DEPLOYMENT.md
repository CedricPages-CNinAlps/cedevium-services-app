# Procédure de déploiement sur GitHub Pages

## Déploiement depuis la branche master vers gh-pages

### Étape 1 : Se placer sur la branche master
```bash
git checkout master
```

### Étape 2 : S'assurer que tous les changements sont commités
```bash
git add .
git commit -m "Description de vos changements"
```

### Étape 3 : Build le projet pour la production
```bash
yarn build
```
ou
```bash
npm run build
```

### Étape 4 : Ajouter les fichiers build au commit
```bash
git add build/
git commit -m "Update build with latest changes"
```

### Étape 5 : Déployer sur la branche gh-pages
```bash
git subtree push --prefix build origin gh-pages
```

### Étape 6 : Synchroniser la branche master (optionnel)
```bash
git push origin master
```

---

## Script de déploiement complet (une seule commande)

### Option A : Copier-coller ce script
```bash
git add . && git commit -m "Update project" && yarn build && git add build/ && git commit -m "Update build" && git subtree push --prefix build origin gh-pages && git push origin master
```

### Option B : Script bash (créer deploy.sh)
```bash
#!/bin/bash
echo "🚀 Déploiement sur GitHub Pages..."

# Commit des changements
git add .
git commit -m "Update project"

# Build
yarn build

# Commit du build
git add build/
git commit -m "Update build"

# Déploiement sur gh-pages
git subtree push --prefix build origin gh-pages

# Synchronisation master
git push origin master

echo "✅ Déploiement terminé !"
```

Pour utiliser le script :
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## Vérification du déploiement

### URL du site
https://cedricpages-cninalps.github.io/cedevium-services-app

### Vérifier l'état des branches
```bash
git branch -a
```

### Vérifier les derniers commits
```bash
git log --oneline -3
```

---

## Configuration GitHub Pages

Assurez-vous que GitHub Pages est configuré pour utiliser :
- **Source** : Deploy from a branch
- **Branch** : gh-pages
- **Folder** : / (root)

---

## Problèmes courants

### Si le build n'est pas à jour
```bash
rm -rf build/
yarn build
```

### Si gh-pages est en retard
```bash
git checkout gh-pages
git pull origin gh-pages
git checkout master
```

### Si les couleurs ne s'affichent pas
Vérifiez que le fichier `src/styles/globals.css` est bien importé dans `src/index.css`.

---

## Résumé rapide

Pour déploiement rapide :
```bash
yarn build && git add build/ && git commit -m "Update build" && git subtree push --prefix build origin gh-pages
```
