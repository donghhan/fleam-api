import { stringArg, mutationField, nonNull, list } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// Follow User Mutation
export const FollowUserMutation = mutationField("followUser", {
  type: "FollowUserResult",
  args: {
    username: nonNull(stringArg()),
  },
  async resolve(_, { username }, { signedInUser }) {
    protectorResolver(signedInUser);

    // Check if that User exists with that username
    const alreadyExistingUser = await client.user.findUnique({
      where: { username },
    });

    if (!alreadyExistingUser) {
      return {
        ok: false,
        error: "That user does not exist.",
      };
    }

    await client.user.update({
      where: {
        id: signedInUser.id,
      },
      data: {
        following: {
          connect: {
            username,
          },
        },
      },
    });

    return {
      ok: true,
    };
  },
});

// Unfollow User Mutation
export const UnfollowUserMutation = mutationField("unfollowUser", {
  type: "FollowUserResult",
  args: {
    username: nonNull(stringArg()),
  },
  async resolve(_, { username }, { signedInUser }) {
    protectorResolver(signedInUser);

    // Check if that User exists with that username
    const alreadyExistingUser = await client.user.findUnique({
      where: { username },
    });

    if (!alreadyExistingUser) {
      return {
        ok: false,
        error: "That user does not exist.",
      };
    }

    await client.user.update({
      where: { id: signedInUser.id },
      data: {
        following: {
          disconnect: {
            username,
          },
        },
      },
    });

    return {
      ok: true,
    };
  },
});

// Searching User Mutation
export const SearchUserMutation = mutationField("searchUsers", {
  type: list("User"),
  args: {
    keyword: nonNull(stringArg()),
  },
  async resolve(_, { keyword }) {
    const users = await client.user.findMany({
      take: 4,
      skip: 1,
      where: { username: { contains: keyword } },
      orderBy: { username: "asc" },
    });

    return users;
  },
});
