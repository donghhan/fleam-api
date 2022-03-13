import { queryField, nonNull, stringArg, list, intArg } from "nexus";
import client from "../../../client";

// See Like Query
export const SeeLikeQuery = queryField("seeLikes", {
  type: list("User"),
  description: "See Like Query",
  args: {
    id: nonNull(stringArg()),
  },
  async resolve(_, { id }) {
    const likes = await client.like.findMany({
      where: { photoId: id },
      select: { user: true },
    });
    return likes.map((like) => like.user);
  },
});
