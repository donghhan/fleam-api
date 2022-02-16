import {
  objectType,
  nonNull,
  stringArg,
  queryField,
  mutationField,
} from "nexus";
import bcrypt from "bcrypt";
import client from "../client";
import jwt from "jsonwebtoken";
// Secret Key
import { FLEAM_SECRET_KEY } from "../utils/keys";
// Utils
import { JwtPayload } from "jsonwebtoken";

// User Type
export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("firstName");
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("password");
    t.nonNull.string("createdAt");
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
  },
  async resolve(_, args, ctx) {
    const { firstName, email, password } = args;
    const { signedInUser } = ctx;

    let hashedPassword;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updateComplete = await client.user.update({
      where: { id: signedInUser?.id },
      data: {
        firstName,
        email,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    if (updateComplete.id) {
      return {
        ok: true,
      };
    } else {
      return {
        error: "Could not update the profile.",
      };
    }
  },
});
