const { ApolloServer } = require('apollo-server');
const { findOrCreateUser } = require('./controllers/userController');
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
  resolvers,
  context: async ({ req }) => {
    let authToken;
    let currentUser;
    try {
      authToken = req.headers.authorization;
      if (authToken) {
        currentUser = await findOrCreateUser(authToken);
      }
    } catch (err) {
      console.log(`Unable to authenticate with token ${authToken}`);
    }
    return { currentUser };
  }
});

server.listen().then(({ url }) => console.log(`Server listening on ${url}`));
