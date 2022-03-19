import { nonNull, stringArg, mutationField } from "nexus";
import bcrypt from "bcrypt";
import client from "../../../client";
import jwt from "jsonwebtoken";
// Secret Key
import { FLEAM_SECRET_KEY } from "../../../utils/keys";

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
    const token = await jwt.sign({ id: registeredUser.id }, FLEAM_SECRET_KEY);

    return {
      ok: true,
      token,
    };
  },
});
