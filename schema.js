const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
  }

  type Query {
    user(id: ID!): User
    product(id: ID!): Product
    products: [Product]
    authenticateUser(username: String!, password: String!): User
    getProduct(id: ID!): Product
    searchProducts(query: String!): [Product]
  }

  type Mutation {
    createUser(username: String!, email: String!): User
    createProduct(name: String!, price: Float!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Product
  }

  input ProductInput {
    name: String!
    price: Float!
  }
`;

module.exports = typeDefs;
