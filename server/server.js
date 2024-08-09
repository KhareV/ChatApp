import { createServer } from 'node:http';
import { createSchema, createYoga } from 'graphql-yoga';

const messages = [
  { id: 0, user: 'Jack', content: 'Hello!!' },
  { id: 1, user: 'Rosa', content: 'Hi!' },
  { id: 2, user: 'Rosa', content: 'How are you?' },
  { id: 3, user: 'Jack', content: 'I am fine' },
];

const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
`;

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    postMessage: (parent, { user, content }) => {
      const id = messages.length;
      messages.push({
        id,
        user,
        content,
      });
      return id;
    },
  },
};

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/', // Serve GraphQL at the root URL
  landingPage: false // Disable the default 404 landing page
});

const server = createServer(yoga);

// Export the server for Vercel
export default server;
