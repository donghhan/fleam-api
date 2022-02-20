import { createWriteStream } from "fs";
import {
  objectType,
  nonNull,
  stringArg,
  queryField,
  mutationField,
  scalarType,
  arg,
  asNexusMethod,
  list,
  intArg,
} from "nexus";
import bcrypt from "bcrypt";
import client from "../client";
import jwt from "jsonwebtoken";
import { GraphQLUpload } from "graphql-upload";
// Secret Key
import { FLEAM_SECRET_KEY } from "../utils/keys";
import { protectorResolver } from "../utils/user.utils";
import { query } from "express";

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

// Signin Type
export const SigninResult = objectType({
  name: "OkResult",
  definition(t) {
    t.nonNull.boolean("ok"), t.string("error"), t.string("token");
  },
});

export const Upload = asNexusMethod(GraphQLUpload, "upload");

// Signin Mutation
export const SigninMutation = mutationField("signin", {
  type: "OkResult",
  args: {
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(_, args, ctx) {
    const { id, username, password } = args;

    // Finding user with username
    const registeredUser = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (!registeredUser) {
      return {
        ok: false,
        error: "There is no user with that username.",
      };
    }

    // Check password
    const comparePassword = await bcrypt.compare(
      password,
      registeredUser.password
    );

    if (!comparePassword) {
      return {
        ok: false,
        error: "Password is not correct.",
      };
    }

    // Issue a token and send it to the user
    const token = await jwt.sign(
      { id: registeredUser.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      FLEAM_SECRET_KEY
    );

    return {
      ok: true,
      token,
    };
  },
});

// seeProfile Query
export const UserQuery = queryField("seeProfile", {
  type: list("User"),
  args: {
    username: nonNull(stringArg()),
  },
  resolve(_, { username }, ctx) {
    return client.user.findUnique({
      where: { username },
      include: { following: true, followers: true },
    });
  },
});

// Signup Mutation
export const CreateAccountMutation = mutationField("createAccount", {
  type: "User",
  args: {
    firstName: nonNull(stringArg()),
    username: nonNull(stringArg()),
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(_, { firstName, username, email, password }, ctx) {
    // Check if username or email already exists
    const alreadyExistingUser = await client.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (alreadyExistingUser) {
      throw new Error("This username/password is already taken.");
    }

    // Validation REGEX
    const REGEX = {
      EMAIL: /\S+@\S+\.\S+/,
      PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    };

    // Email Validation
    if (REGEX.EMAIL.test(email) === false) {
      throw new Error("You should input correct format of email address.");
    }

    // Password Validation
    if (REGEX.PASSWORD.test(password) === false) {
      throw new Error(
        "Password must be at least 8 characters, including at least one of uppercase, lowercase, number and special character."
      );
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    return client.user.create({
      data: { username, email, firstName, password: hashedPassword },
    });
  },
});

// EditProfile Mutation
export const EditProfileMutation = mutationField("editProfile", {
  type: "OkResult",
  args: {
    firstName: stringArg(),
    email: stringArg(),
    password: stringArg(),
    bio: stringArg(),
    avatar: arg({ type: "Upload" }),
  },
  async resolve(
    _,
    { firstName, email, password: newPassword, bio, avatar },
    { signedInUser, protectorResolver }
  ) {
    protectorResolver(signedInUser);

    let avatarUrl = null;
    let hashedPassword = null;

    if (avatar) {
      const { filename, createReadStream } = await avatar;
      const newFilename = `${signedInUser.id}-${filename}`;
      const readStream = createReadStream();
      const writeStream = createWriteStream(
        process.cwd() + "/uploads/" + filename
      );
      readStream.pipe(writeStream);
      avatarUrl = `http://localhost:8090/graphql/static/${newFilename}`;
    }

    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    const updateComplete = await client.user.update({
      where: { id: signedInUser.id },
      data: {
        firstName,
        email,
        bio,
        ...(hashedPassword && { password: hashedPassword }),
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    if (updateComplete.id) {
      return {
        ok: true,
      };
    } else {
      return { ok: false, error: "Could not update profile." };
    }
  },
});

// Follow User Mutation
export const FollowUserMutation = mutationField("followUser", {
  type: "OkResult",
  args: {
    username: stringArg(),
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
  type: "OkResult",
  args: {
    username: stringArg(),
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

export const SeeFollowerQuery = queryField("seeFollower", {
  type: "FollowerResult",
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

export const SeeFollowingQuery = queryField("seeFollowing", {
  type: "FollowerResult",
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
      });

    return {
      ok: true,
      following,
    };
  },
});
