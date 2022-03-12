import { objectType } from "nexus";

// Photo Type
export const Photo = objectType({
  name: "Photo",
  description: "Photo object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.field("user", { type: "User" });
    t.nonNull.string("file");
    t.string("caption");
    t.list.field("hashtag", { type: "Hashtag" });
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

// Hashtag Type
export const Hashtag = objectType({
  name: "Hashtag",
  description: "Hashtag object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("hashtag");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.list.field("photos", { type: "Photo" });
  },
});
