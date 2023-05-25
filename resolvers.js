// resolvers.js

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les microservices
const authProtoPath = 'auth.proto';
const productProtoPath = 'product.proto';

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

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Query: {
    authenticateUser: (_, { username, password }) => {
      // Effectuer un appel gRPC au microservice d'authentification
      const client = new authProto.AuthService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.authenticate({ username, password }, (err, response) => {
          if (err) {
            reject(err.details);
          } else {
            resolve(response);
          }
        });
      });
    },
    getProduct: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de gestion des produits
      const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getProduct({ id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.product);
          }
        });
      });
    },
    searchProducts: (_, { query }) => {
      // Effectuer un appel gRPC au microservice de gestion des produits
      const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchProducts({ query }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.products);
          }
        });
      });
    },
  },
  Mutation: {
    createProduct: (_, { input }) => {
      // Effectuer un appel gRPC au microservice de gestion des produits
      const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.createProduct({ input }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.product);
          }
        });
      });
    },
    updateProduct: (_, { id, input }) => {
      // Effectuer un appel gRPC au microservice de gestion des produits
      const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.updateProduct({ id, input }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.product);
          }
        });
      });
    },
    deleteProduct: (_, { id }) => {
      // Effectuer un appel gRPC au microservice de gestion des produits
      const client = new productProto.ProductService('localhost:50052', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.deleteProduct({ id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.product);
          }
        });
      });
    },
  },
};

module.exports = resolvers;

