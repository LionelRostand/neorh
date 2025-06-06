
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

# Créer un utilisateur non-root
RUN getent group node || addgroup -g 1000 node
RUN adduser -u 1000 -G node -s /bin/sh -D node || echo "User node already exists"

# Définir le répertoire de travail
WORKDIR /neorh

# Installer Express localement
RUN npm init -y && npm install express

# Copier les fichiers buildés et le serveur
COPY --from=builder /neorh/dist ./dist
COPY --from=builder /neorh/src/server.js ./src/

# Changer la propriété des fichiers pour l'utilisateur node
USER root
RUN chown -R node:node /neorh
USER node

# Définir les variables d'environnement
ENV NODE_ENV=production

# Exposer le port HTTPS
EXPOSE 3008

# Commande pour démarrer le serveur HTTPS
CMD ["node", "src/server.js"]
