# ProjetApi
Les deux microservices (authMicroservice.js et productMicroservice.js) sont liés à l'API Gateway (apiGateway.js) et à la base de données MySQL (app.js).

L'API Gateway utilise Apollo Server pour créer un serveur GraphQL. 
Il importe les fichiers de définition des protocoles (auth.proto et product.proto) à l'aide de protoLoader. 
Ensuite, il crée des clients gRPC pour les microservices d'authentification et de gestion des produits.

Dans l'API Gateway, les endpoints /auth/user/:id et /products sont définis pour interagir avec les microservices. 
L'endpoint /auth/user/:id utilise le client gRPC du microservice d'authentification pour appeler la méthode getUser, 
tandis que les endpoints /products utilisent le client gRPC du microservice de gestion des produits pour appeler les méthodes 
createProduct et getProduct.

Les fichiers authMicroservice.js et productMicroservice.js sont les implémentations des microservices d'authentification et 
de gestion des produits respectivement. Ils chargent les fichiers de définition des protocoles à l'aide de 
protoLoader et créent des serveurs gRPC. Les méthodes du service d'authentification (authenticate) et 
du service de gestion des produits (getProduct et createProduct) sont implémentées dans ces fichiers.

Le fichier app.js crée une connexion à la base de données MySQL et l'exporte pour être utilisée dans 
d'autres fichiers.

Les fichiers resolvers.js et schema.js définissent les résolveurs et le schéma GraphQL 
utilisés par Apollo Server dans l'API Gateway.

Veuillez noter que les adresses IP et les numéros de port utilisés dans les fichiers sont configurés pour une utilisation locale (localhost). Vous devrez peut-être les ajuster en fonction de votre environnement de déploiement.
