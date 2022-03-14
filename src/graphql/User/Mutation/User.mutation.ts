import { createWriteStream } from "fs";
import { nonNull, stringArg, mutationField, arg } from "nexus";
import bcrypt from "bcrypt";
import client from "../../../client";
import jwt from "jsonwebtoken";
// Secret Key
import { FLEAM_SECRET_KEY } from "../../../utils/keys";
import { protectorResolver } from "../../../utils/user.utils";

// Signin Mutation
export const SigninMutation = mutationField("signin", {
  type: "SigninWithTokenResult",
  args: {
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(_, { username, password }) {
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

// createAccount Mutation
export const CreateAccountMutation = mutationField("createAccount", {
  type: "User",
  args: {
    firstName: nonNull(stringArg()),
    username: nonNull(stringArg()),
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(_, { firstName, username, email, password }) {
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

// editProfile Mutation
export const EditProfileMutation = mutationField("editProfile", {
  type: "GlobalResult",
  args: {
    firstName: stringArg(),
    email: stringArg(),
    password: stringArg(),
    bio: stringArg(),
    avatar: arg({ type: "Upload" }),
  },
  resolve: protectorResolver(
    async (
      _,
      { firstName, email, password: newPassword, bio, avatar },
      { signedInUser }
    ) => {
      let avatarUrl: string | null = null;
      let hashedPassword: string | null = null;

      if (avatar) {
        const { filename, createReadStream } = await avatar;
        const newFilename = `${signedInUser.id}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(
          process.cwd() + "/uploads/" + filename
        );
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4500/graphql/static/${newFilename}`;
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
    }
  ),
});
