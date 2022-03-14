import { queryField, list } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// See Feed Mutation
export const SeeFeedMutation = queryField("seeFeed", {
  type: list("Photo"),
  description: "See Feed Query",
  resolve: protectorResolver((_, __, { signedInUser }) => {
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
  }),
});
