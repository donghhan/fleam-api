import { nonNull, stringArg, queryField, list } from "nexus";
import client from "../../../client";

// See Product Query
export const SeeProductQuery = queryField("seeProduct", {
  type: "Product",
  description: "See Product Query",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: (_, { id }, {}) => {
    return client.product.findUnique({ where: { id } });
  },
});
