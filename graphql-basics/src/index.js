import { createSchema, createYoga } from "graphql-yoga";
import { PubSub } from "graphql-subscriptions";
import { createServer } from "node:http";

import db from "./db";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const pubsub = new PubSub();

// type definitions (application schema)
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  context: {
    db,
    pubsub,
  },
});

const server = createServer(yoga);

server.listen(4000, () => {
  console.log("Server is running");
});
