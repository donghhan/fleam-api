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
} from "nexus";
import bcrypt from "bcrypt";
import client from "../client";
import jwt from "jsonwebtoken";
import { GraphQLUpload } from "graphql-upload";
// Secret Key
import { FLEAM_SECRET_KEY } from "../utils/keys";

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
  type: "User",
  args: {
    username: nonNull(stringArg()),
  },
  resolve(_, args, ctx) {
    const { username } = args;
    return client.user.findUnique({ where: { username } });
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
  async resolve(_, args, ctx) {
    const { firstName, username, email, password } = args;

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
  },
  async resolve(
    _,
    { firstName, email, password: newPassword, bio },
    { signedInUser, protectorResolver }
  ) {
    protectorResolver(signedInUser);

    let hashedPassword = null;

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

// Upload Profile Mutation
export const UpdateProfileAvatarMutation = mutationField(
  "updateProfileAvatar",
  {
    type: "OkResult",
    args: {
      avatar: arg({ type: "Upload" }),
    },
    async resolve(_, { avatar }, { signedInUser, protectorResolver }) {
      protectorResolver(signedInUser);

      let avatarUrl = null;

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

      const updateAvatar = await client.user.update({
        where: {
          id: signedInUser.id,
        },
        data: {
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      });

      if (updateAvatar.id) {
        return {
          ok: true,
        };
      } else {
        return { ok: false, error: "Could not update profile avatar." };
      }
    },
  }
);
