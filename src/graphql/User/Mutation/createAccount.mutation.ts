import { nonNull, stringArg, mutationField } from "nexus";
import bcrypt from "bcrypt";
import client from "../../../client";
// Secret Key
import { FLEAM_SECRET_KEY } from "../../../utils/keys";

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
      throw new Error("This username/email is already taken.");
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
