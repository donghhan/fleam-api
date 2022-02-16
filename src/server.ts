import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { getUser, protectorResolver } from "./utils/user.utils";

export const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    return {
      signedInUser: await getUser(req.headers.token),
      protectorResolver,
    };
  },
});

const port = 8090;

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
