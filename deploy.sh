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

if [ $? -eq 0 ]; then
    echo "✅ Push réussi !"
    echo "🌐 Le workflow GitHub Actions va se déclencher automatiquement"
    echo "⏱️  Votre site sera disponible dans 1-2 minutes sur :"
    echo "🔗 https://cedricpages-cninalps.github.io/cedevium-services-app"
    echo ""
    echo "📊 Suivez le déploiement dans l'onglet 'Actions' de votre repository GitHub"
else
    echo "❌ Erreur: Le push a échoué"
    exit 1
fi

echo "🎉 Déploiement lancé avec succès !"
