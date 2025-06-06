
# Étape 1: Build de l'application avec Node.js
FROM node:18.20.7-alpine AS builder

# Activer Corepack pour utiliser Yarn directement
RUN corepack enable

# Définir le répertoire de travail
WORKDIR /neorh

# Copier uniquement les fichiers nécessaires pour l'installation des dépendances
COPY package*.json ./

# Configurer Yarn pour qu'il soit plus tolérant aux problèmes de réseau
RUN yarn config set network-timeout 300000 && \
    yarn config set httpRetry 5 && \
    yarn config set httpsRetry 5 && \
    # Ajouter l'option legacy-peer-deps pour résoudre les conflits de dépendances
    yarn config set legacy-peer-deps true

# Installer les dépendances avec des retry en cas d'échec et l'option legacy-peer-deps
RUN yarn install --frozen-lockfile --network-timeout 300000 --legacy-peer-deps || \
    yarn install --frozen-lockfile --network-timeout 300000 --legacy-peer-deps || \
    yarn install --frozen-lockfile --network-timeout 300000 --legacy-peer-deps

# Copier le reste du projet
COPY . .

# Install vite
RUN npm install vite --save-dev --force

# Construire l'application
RUN npx vite build

# Étape 2: Image finale optimisée
FROM node:18.20.7-alpine

# Installer serve globalement
RUN npm install -g serve

# Créer un utilisateur non-root
RUN getent group node || addgroup -g 1000 node
RUN adduser -u 1000 -G node -s /bin/sh -D node || echo "User node already exists"

# Passer en utilisateur sécurisé
USER node

# Définir le répertoire de travail
WORKDIR /neorh

# Copier uniquement les fichiers nécessaires pour exécuter l'application
COPY --from=builder /neorh/dist ./dist

# Définir les variables d'environnement
ENV NODE_ENV=production

# Exposer le port
EXPOSE 3008

# Commande pour démarrer l'application
CMD ["serve", "-s", "dist", "-l", "3008"]
