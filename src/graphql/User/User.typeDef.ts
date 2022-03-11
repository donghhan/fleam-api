import { asNexusMethod, objectType } from "nexus";
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
    t.nonNull.boolean("isFollowing");
    t.nonNull.boolean("isMyself");
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

// scalarType for file uploads
export const Upload = asNexusMethod(GraphQLUpload, "upload");

// objectType for fetching following results
export const FollowUserResult = objectType({
  name: "FollowUserResult",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
  },
});

// objectType for followers pagination
export const SeeFollowerResult = objectType({
  name: "SeeFollowerResult",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
    t.int("totalPages");
    t.list.field("followers", {
      type: User,
    });
  },
});

// objectType for following pagination
export const SeeFollowingResult = objectType({
  name: "SeeFollowingResult",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
    t.list.field("following", {
      type: User,
    });
  },
});
