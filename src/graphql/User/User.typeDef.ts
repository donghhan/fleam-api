import { objectType, asNexusMethod } from "nexus";
import { GraphQLUpload } from "graphql-upload";

// User Type
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.string("firstName");
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("password");
    t.nonNull.string("createdAt");
    t.string("bio");
    t.string("avatar");
    t.nonNull.string("updatedAt");
    t.list.field("following", { type: User });
    t.list.field("followers", { type: User });
    // t.nonNull.boolean("isFollowing");
    // t.nonNull.boolean("isMe");
    t.nonNull.int("totalFollowing");
    t.nonNull.int("totalFollower");
  },
});

// OkResult
export const OkResult = objectType({
  name: "OkResult",
  definition(t) {
    t.nonNull.boolean("ok"), t.string("error"), t.string("token");
  },
});

export const Upload = asNexusMethod(GraphQLUpload, "upload");

export const FollowerResult = objectType({
  name: "FollowerResult",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
    t.list.field("followers", { type: User });
    t.list.field("following", { type: User });
    t.int("totalPages");
  },
});
