import { nonNull, stringArg, queryField, intArg } from "nexus";
import client from "../../../client";

// See Hashtag Query
export const SeeHashtagQuery = queryField("seeHashtag", {
  type: "Hashtag",
  args: {
    hashtag: nonNull(stringArg()),
  },
  resolve: (_, { hashtag }, {}) => {
    return client.hashtag.findUnique({ where: { hashtag } });
  },
});
