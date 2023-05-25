const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier auth.proto
const authProtoPath = 'auth.proto';
const authProtoDefinition = protoLoader.loadSync(authProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const authProto = grpc.loadPackageDefinition(authProtoDefinition).auth;

// Implémenter le service d'authentification
const authService = {
  authenticate: (call, callback) => {
    const { username, password } = call.request;
    // Logique d'authentification ici, vérification des identifiants, génération de jeton, etc.
    const token = 'exemple_token';
    callback(null, { success: true, message: 'Authentification réussie', token });
  },
  // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(authProto.AuthService.service, authService);

const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, bindPort) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${bindPort}`);
  server.start();
});

console.log(`Microservice d'authentification en cours d'exécution sur le port ${port}`);