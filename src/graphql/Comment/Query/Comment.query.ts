import { queryField, nonNull, stringArg, list } from "nexus";
import client from "../../../client";

// See Photo Comments Query
export const SeePhotoCommentsQuery = queryField("seePhotoComments", {
  type: list("Comment"),
  description: "See Photo Comments Query",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: (_, { id }) => {
    return client.comment.findMany({
      where: { photoId: id },
      orderBy: { createdAt: "asc" },
    });
  },
});
