import { objectType } from "nexus";
import client from "../client";

// User Type
export const User = objectType({
  name: "User",
  description: "User object type",
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
    t.nonNull.boolean("isFollowing", {
      async resolve({ id }, _, { signedInUser }) {
        if (!signedInUser) {
          return false;
        }

        const exists = await client.user.count({
          where: {
            username: signedInUser.username,
            following: { some: { id } },
          },
        });

        return Boolean(exists);
      },
    });
    // Computed field showing whether signedin account is user itself
    t.nonNull.boolean("isMyself", {
      resolve({ id }, _, { signedInUser }) {
        if (!signedInUser) {
          return false;
        }
        return id === signedInUser.id;
      },
    });
    // Computed field for fetching total number of followings
    t.nonNull.int("totalFollowing", {
      resolve({ id }) {
        return client.user.count({ where: { followers: { some: { id } } } });
      },
    });
    // Computed field for fetching total number of followers
    t.nonNull.int("totalFollower", {
      resolve({ id }) {
        return client.user.count({ where: { following: { some: { id } } } });
      },
    });
  },
});

// SigninWithTokenResult
export const SigninWithTokenResult = objectType({
  name: "SigninWithTokenResult",
  description: "Object type for showing success/failure of signin & signup",
  definition(t) {
    t.nonNull.boolean("ok"), t.string("error"), t.string("token");
  },
});

// SignupErrorResult
export const SignupResult = objectType({
  name: "SignupResult",
  description: "Signup Result object type",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("errorType");
    t.string("error");
  },
});

// Global Result Type
export const GlobalResult = objectType({
  name: "GlobalResult",
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
    t.int("totalFollower", {
      // Computed field of totalFollowing
      description: "Number of total followers",
      resolve: ({ id }, _, ctx) => {
        client.user.count({
          where: {
            following: {
              some: {
                id,
              },
            },
          },
        });
      },
    });
  },
});

// objectType for following pagination
export const SeeFollowingResult = objectType({
  name: "SeeFollowingResult",
  description: "SeeFollowingResult object type",
  definition(t) {
    t.nonNull.boolean("ok");
    t.string("error");
    t.list.field("following", {
      type: User,
    });
    t.int("totalFollowing", {
      // Computed field of totalFollowing
      description: "Number of total following",
      resolve: async ({ id }, {}, { client }) => {
        const totalFollowings = await client.followings({
          where: { followers: { id } },
        });
        return totalFollowings.length;
      },
    });
  },
});

// Message Type
export const Message = objectType({
  name: "Message",
  description: "Message object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.nonNull.string("payload");
    t.nonNull.field("user", { type: "User" });
    t.nonNull.field("room", { type: "ChatRoom" });
  },
});

// ChatRoom Type
export const ChatRoom = objectType({
  name: "ChatRoom",
  description: "ChatRoom object type",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
    t.list.field("user", { type: "User" });
    t.list.field("messages", { type: "Message" });
  },
});
