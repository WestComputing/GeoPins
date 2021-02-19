const { ApolloServer } = require('apollo-server');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, { useUnifiedTopology: true })
  .then(() => console.log('Mongoose connected'))
  .catch(err => console.error(err));

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
