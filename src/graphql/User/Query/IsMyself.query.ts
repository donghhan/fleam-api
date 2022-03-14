import { queryField, list } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// isMyself Query
export const IsMyselfQuery = queryField("isMyself", {
  type: "User",
  description: "isMyself Query",
  resolve: protectorResolver((_, __, { signedInUser }) => {
    return client.user.findUnique({ where: { id: signedInUser.id } });
  }),
});
