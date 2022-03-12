import { nonNull, stringArg, queryField, list } from "nexus";
import client from "../../../client";

// seeProfile Query
export const UserQuery = queryField("seeProfile", {
  type: "User",
  description: "Query field for viewing the user profile",
  args: {
    username: nonNull(stringArg()),
  },
  resolve(_, { username }, {}) {
    return client.user.findUnique({
      where: { username },
      include: { following: true, followers: true },
    });
  },
});
