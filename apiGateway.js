// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const connection = require('./app');


// Charger les fichiers proto pour l'authentification et les produits
const authProtoPath = 'auth.proto';
const productProtoPath = 'product.proto';

const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();

const authProtoDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const authProto = grpc.loadPackageDefinition(authProtoDefinition).auth;
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );
});

app.get('/auth/user/:id', (req, res) => {
  const client = new authProto.AuthService('localhost:50053', grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getUser({ userId: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.user);
    }
  });
});

app.post('/products', (req, res) => {
  const client = new productProto.ProductService('localhost:50054', grpc.credentials.createInsecure());
  const product = req.body;
  client.createProduct({ product }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.product_id);
    }
  });
});


app.get('/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête :', err);
      res.status(500).json({ error: 'Erreur du serveur' });
    } else {
      console.log('Résultat de la requête :', rows);
      res.json(rows);
    }
  });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
