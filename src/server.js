
const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

// Servir les fichiers statiques depuis le dossier dist
app.use(express.static(path.join(__dirname, '../dist')));

// Gérer toutes les routes pour le SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const options = {
  key: fs.readFileSync('/etc/ssl/tls.key'),
  cert: fs.readFileSync('/etc/ssl/tls.crt')
};

https.createServer(options, app).listen(3008, () => {
  console.log('HTTPS server started on port 3008');
});
