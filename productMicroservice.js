const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier product.proto
const productProtoPath = 'product.proto';
const productProtoDefinition = protoLoader.loadSync(productProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const productProto = grpc.loadPackageDefinition(productProtoDefinition).product;

// Implémenter le service de gestion des produits
const productService = {
  getProduct: (call, callback) => {
    const { product_id } = call.request;
    // Récupérer les détails du produit à partir de la base de données
    const product = {
      id: product_id,
      name: 'Exemple de produit',
      price: 9.99,
      // Ajouter d'autres champs de données pour le produit au besoin
    };
    callback(null, { product });
  },
  createProduct: (call, callback) => {
    const { product } = call.request;
    // Enregistrer le produit dans la base de données et générer un nouvel ID
    const product_id = 'nouvel_id_produit';
    callback(null, { product_id });
  },
  // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(productProto.ProductService.service, productService);

const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});

console.log(`Microservice de gestion des produits en cours d'exécution sur le port ${port}`);
