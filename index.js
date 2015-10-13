const port = process.env.PORT || 8080;

// Express
import express from "express";
import graphqlHTTP from "express-graphql";
const app = express();

import schema from "./schema";
import loaders from "./loaders";

// GraphQL routing
app.use("/graphql", graphqlHTTP({
    schema: schema,
    rootValue: loaders,
    graphiql: true
}));

// start
app.listen(port);

