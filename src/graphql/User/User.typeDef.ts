import { asNexusMethod, objectType } from "nexus";
import { GraphQLUpload } from "graphql-upload";
import client from "../../client";

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

// OkResult
export const OkResult = objectType({
  name: "OkResult",
  description: "Object type for showing success/failure of signin & signup",
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
