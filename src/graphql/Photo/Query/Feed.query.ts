import { queryField, nonNull, stringArg, list } from "nexus";
import client from "../../../client";

// See Feed Mutation
export const SeeFeedMutation = queryField("seeFeed", {
  type: list("Photo"),
  description: "See Feed Query",
  args: {},
  resolve(_, args, { protectorResolver, signedInUser }) {
    protectorResolver(signedInUser);
    return client.photo.findMany({
      where: {
        OR: [
          { user: { followers: { some: { id: signedInUser.id } } } },
          { userId: signedInUser.id },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
});
