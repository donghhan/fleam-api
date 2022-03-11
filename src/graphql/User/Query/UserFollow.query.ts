import { createWriteStream } from "fs";
import { nonNull, stringArg, queryField, list, intArg } from "nexus";
import client from "../../../client";
import { FLEAM_SECRET_KEY } from "../../../utils/keys";

export const SeeFollowerQuery = queryField("seeFollowers", {
  type: "SeeFollowerResult",
  args: {
    username: nonNull(stringArg()),
    page: nonNull(intArg()),
  },
  async resolve(_, { username, page }, {}) {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!ok) {
      return {
        ok: false,
        error: "User not found.",
      };
    }

    const followers = await client.user
      .findUnique({ where: { username } })
      .followers({
        take: 5,
        skip: (page - 1) * 5,
      });

    const totalFollowers = await client.user.count({
      where: { following: { some: { username } } },
    });

    return {
      ok: true,
      followers,
      totalPages: Math.ceil(totalFollowers / 5),
    };
  },
});

export const SeeFollowingQuery = queryField("seeFollowings", {
  type: "SeeFollowingResult",
  args: {
    username: nonNull(stringArg()),
    cursor: intArg(),
  },
  async resolve(_, { username, cursor }) {
    const ok = await client.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!ok) {
      return {
        ok: false,
        error: "User not found",
      };
    }

    const following = await client.user
      .findUnique({ where: { username } })
      .following({
        take: 5,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),
        orderBy: {
          id: "asc",
        },
      });

    return {
      ok: true,
      following,
    };
  },
});
