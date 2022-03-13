import { queryField, nonNull, stringArg, intArg } from "nexus";
import client from "../../../client";

// See Photo Query
export const SeePhotoQuery = queryField("seePhoto", {
  type: "Photo",
  description: "See Photo Query",
  args: {
    id: nonNull(stringArg()),
  },
  resolve(_, { id }) {
    return client.photo.findUnique({ where: { id } });
  },
});

// See Hashtag Query
export const SeeHashtagQuery = queryField("seeHashtag", {
  type: "Hashtag",
  description: "See Hashtag Query",
  args: {
    hashtag: nonNull(stringArg()),
  },
  resolve(_, { hashtag }) {
    return client.hashtag.findUnique({ where: { hashtag } });
  },
});
