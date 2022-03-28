import { nonNull, stringArg, mutationField } from "nexus";
import bcrypt from "bcrypt";
import client from "../../../client";
import { UserInputError } from "apollo-server-express";

// createAccount Mutation
export const CreateAccountMutation = mutationField("createAccount", {
  type: "GlobalResult",
  args: {
    firstName: nonNull(stringArg()),
    username: nonNull(stringArg()),
    email: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  async resolve(_, { firstName, username, email, password }) {
    const errors: { property: string; message: string }[] = [];
    // Check if username or email already exists
    const userExistsWithUsername = await client.user.findFirst({
      where: {
        username,
      },
    });

    if (userExistsWithUsername) {
      errors.push({
        property: "username",
        message: "This username is already taken.",
      });
    }

    const userExistsWithEmail = await client.user.findFirst({
      where: { email },
    });

    if (userExistsWithEmail) {
      errors.push({
        property: "email",
        message: "This email is already taken.",
      });
    }

    if (errors.length) {
      throw new UserInputError("Invalid input.", { errors });
    }

    // Validation REGEX
    const REGEX = {
      EMAIL: /\S+@\S+\.\S+/,
      PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
    };

    // Email Validation
    if (REGEX.EMAIL.test(email) === false) {
      return {
        ok: false,
        error: "You should input correct format of email address.",
      };
    }

    // Password Validation
    if (REGEX.PASSWORD.test(password) === false) {
      return {
        ok: false,
        error:
          "Password must be at least 8 characters, including at least one of uppercase, lowercase, number and special character.",
      };
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    await client.user.create({
      data: { username, email, firstName, password: hashedPassword },
    });
    return {
      ok: true,
    };
  },
});
