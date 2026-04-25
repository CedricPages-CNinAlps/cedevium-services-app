#!/bin/bash

echo "🚀 Déploiement automatique sur GitHub Pages..."

# Vérifier si on est sur la branche master
if [ "$(git branch --show-current)" != "master" ]; then
    echo "❌ Erreur: Vous devez être sur la branche master pour déployer"
    echo "📋 Commande: git checkout master"
    exit 1
fi

# Vérifier s'il y a des changements non commités
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Changements non commités détectés"
    echo "📋 Commit automatique des changements..."
    git add .
    git commit -m "Auto-commit before deployment"
fi

echo "🔨 Build du projet..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Erreur: Le build a échoué"
    exit 1
fi

echo "📦 Commit des fichiers de build..."
git add build/
git commit -m "Update build for deployment"

echo "🚀 Déploiement sur gh-pages..."
git subtree push --prefix build origin gh-pages

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Site disponible: https://cedricpages-cninalps.github.io/cedevium-services-app"
    echo "⏱️  Attendez 1-2 minutes pour la propagation GitHub Pages"
else
    echo "❌ Erreur: Le déploiement a échoué"
    exit 1
fi

echo "🔄 Synchronisation de la branche master..."
git push origin master

echo "🎉 Déploiement terminé avec succès !"
