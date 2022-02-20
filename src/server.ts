import express from "express";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";
import { schema } from "./schema";
import { getUser, protectorResolver } from "./utils/user.utils";
import { Application } from "express";

const startServer = async () => {
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      return {
        signedInUser: await getUser(req.headers.authorization),
        protectorResolver,
      };
    },
  });
  await server.start();

  const app: Application = express();

  app.use(graphqlUploadExpress());
  app.use("/static", express.static("uploads"));

  server.applyMiddleware({ app });

  const port: number | string = process.env.PORT || 8090;

  await new Promise<void>((r) => app.listen({ port }, r));

  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
};

startServer();
