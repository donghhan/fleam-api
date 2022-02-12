import { objectType, extendType, nonNull, stringArg, queryField } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import CryptoJS from "crypto-js";
import client from "../client";
// Secret Key
import { FLEAM_SECRET_KEY } from "../utils/keys";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("firstName");
    t.nonNull.string("email");
    t.nonNull.string("username");
    t.nonNull.string("password");
    t.nonNull.string("createdAt");
    t.nonNull.string("updatedAt");
  },
});

export const UserQuery = queryField("seeprofile", {
  type: "Query",
  args: {
    username: nonNull(stringArg()),
    email: nonNull(stringArg()),
  },
  resolve(parent, args, context) {
    const { username, email } = args;
    client.user.findUnique({ where: { username, email } });
  },
});

export const UserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createAccount", {
      type: "User",
      args: {
        firstName: nonNull(stringArg()),
        username: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },

      async resolve(parent, args, context) {
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

        // Validation
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
        const hashedPassword = await CryptoJS.AES.encrypt(
          password,
          FLEAM_SECRET_KEY
        ).toString();

        return client.user.create({
          data: { username, email, firstName, password: hashedPassword },
        });
      },
    });
  },
});

let users: NexusGenObjects["User"][] = [
  // 1
  {
    id: 1,
    firstName: "Donghoon",
    email: "dhstar914@naver.com",
    username: "dhstar914",
    password: "abc123",
    createdAt: "2021-01-02",
    updatedAt: "2021-01-02",
  },
  {
    id: 2,
    firstName: "Jihyeong",
    email: "lily9497@naver.com",
    username: "lily9497",
    password: "abcd1234",
    createdAt: "2021-01-02",
    updatedAt: "2021-01-02",
  },
];
