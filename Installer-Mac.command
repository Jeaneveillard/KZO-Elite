#!/bin/bash
cd "$(dirname "$0")"

echo ""
echo "========================================"
echo "  KZO InspectPro Elite — Installation Mac"
echo "========================================"
echo ""

# Vérifier Node.js
if ! command -v node &>/dev/null; then
  echo "  ❌ Node.js non trouvé."
  echo ""
  echo "  Installez Node.js depuis : https://nodejs.org"
  echo "  Puis relancez ce fichier."
  echo ""
  open "https://nodejs.org"
  read -p "  Appuyez sur Entrée pour quitter..."
  exit 1
fi

NODE_VER=$(node -v)
echo "  ✅ Node.js $NODE_VER détecté"
echo ""

# Installer les dépendances
echo "  📦 Installation des dépendances..."
npm install --silent
if [ $? -ne 0 ]; then
  echo ""
  echo "  ❌ Erreur lors de npm install."
  read -p "  Appuyez sur Entrée pour quitter..."
  exit 1
fi
echo "  ✅ Dépendances installées"
echo ""

# Compiler le .dmg
echo "  🔨 Compilation de l'application Mac..."
npm run build:mac
if [ $? -ne 0 ]; then
  echo ""
  echo "  ❌ Erreur lors de la compilation."
  read -p "  Appuyez sur Entrée pour quitter..."
  exit 1
fi
echo ""

# Ouvrir le dossier dist
DMG=$(ls dist/*.dmg 2>/dev/null | head -1)
if [ -n "$DMG" ]; then
  echo "  ✅ Fichier créé : $DMG"
  echo ""
  echo "  📂 Ouverture du dossier dist..."
  open dist/
  echo ""
  echo "  Double-cliquez sur le .dmg pour installer l'application."
  echo "  Si macOS bloque : Clic droit → Ouvrir → Ouvrir quand même"
else
  echo "  ⚠️  Compilation terminée mais .dmg introuvable dans dist/"
  open dist/ 2>/dev/null
fi

echo ""
echo "========================================"
echo "  Installation terminée !"
echo "========================================"
echo ""
read -p "  Appuyez sur Entrée pour fermer..."
