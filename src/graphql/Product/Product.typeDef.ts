import { asNexusMethod, objectType, nonNull, intArg } from "nexus";
import { GraphQLUpload } from "graphql-upload";
import client from "../../client";

// Product Type Definition
export const Product = objectType({
  name: "Product",
  description: "Product object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.nonNull.int("price");
    t.int("discountPrice");
    t.string("brand");
    t.string("description");
    t.nonNull.string("size");
    t.nonNull.string("color");
    t.nonNull.string("location");
    t.nonNull.boolean("isFreeShipping");
    t.int("domesticShippingCharge");
    t.nonNull.boolean("isWorldWideShipping");
    t.int("worldwideShippingCharge");
    t.nonNull.string("category");
    t.int("age");
    t.nonNull.string("condition");
    t.field("user", { type: "User" });
    t.nonNull.list.string("photos");
    t.nonNull.field("user", {
      type: "User",
      resolve({ userId }) {
        return client.user.findUnique({ where: { id: userId } });
      },
    });
    t.list.field("hashtags", {
      type: "Hashtag",
      resolve({ id }) {
        return client.hashtag.findMany({
          where: { products: { some: { id } } },
        });
      },
    });
  },
});

// scalarType for photo uploads
export const Upload = asNexusMethod(GraphQLUpload, "upload");

// Hashtag Type Definition
export const Hashtag = objectType({
  name: "Hashtag",
  description: "Hashtag object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.nonNull.string("hashtag");
    t.list.field("products", { type: "Product" });
  },
});
