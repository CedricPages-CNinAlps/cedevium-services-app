#!/bin/bash

echo "🚀 Déploiement automatique sur GitHub Pages..."

# Vérifier si on est sur la branche master
if [ "$(git branch --show-current)" != "master" ]; then
    echo "❌ Erreur: Vous devez être sur la branche master pour déployer"
    echo "📋 Commande: git checkout master"
    exit 1
fi

# Ajouter tous les fichiers
echo "📋 Ajout des fichiers modifiés..."
git add .

# Vérifier s'il y a des changements à commit
if [ -z "$(git status --porcelain)" ]; then
    echo "ℹ️  Aucun changement à déployer"
    exit 0
fi

# Demander le message de commit
echo "💬 Entrez votre message de commit (ou laissez vide pour le message par défaut):"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="Mise à jour du site"
fi

# Commiter les changements
echo "📝 Commit des changements..."
git commit -m "$commit_message"

# Pousser sur master
echo "🔄 Push sur master..."
git push origin master

if [ $? -ne 0 ]; then
    echo "❌ Erreur: Le push sur master a échoué"
    exit 1
fi

echo "✅ Push sur master réussi !"

# Build du projet
echo "🔨 Build du projet..."
yarn build

if [ $? -ne 0 ]; then
    echo "❌ Erreur: Le build a échoué"
    exit 1
fi

# Déployer sur gh-pages
echo "🚀 Déploiement sur gh-pages..."
git subtree push --prefix build origin gh-pages

if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi !"
    echo "🌐 Votre site est disponible sur :"
    echo "🔗 https://cedricpages-cninalps.github.io/cedevium-services-app"
    echo "⏱️  Attendez 1-2 minutes pour la propagation GitHub Pages"
else
    echo "❌ Erreur: Le déploiement a échoué"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès !"
