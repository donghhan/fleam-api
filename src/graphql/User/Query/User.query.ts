import { nonNull, stringArg, queryField, list } from "nexus";
import client from "../../../client";

// seeProfile Query
export const UserQuery = queryField("seeProfile", {
  type: list("User"),
  args: {
    username: nonNull(stringArg()),
  },
  resolve(_, { username }, ctx) {
    return client.user.findUnique({
      where: { username },
      include: { following: true, followers: true },
    });
  },
});
