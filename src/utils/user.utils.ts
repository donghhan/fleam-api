import jwt from "jsonwebtoken";
import client from "../client";
import { FLEAM_SECRET_KEY } from "./keys";
import { JwtPayload } from "./interface";

interface IProtectorResolver {
  protectorResolver: any;
}
interface ICustomResolver {
  customResolver: Function;
}

export const getUser = async (authorization: any) => {
  try {
    if (!authorization) {
      return null;
    }

    const { id } = (await jwt.verify(
      authorization,
      FLEAM_SECRET_KEY
    )) as JwtPayload;
    const user = await client.user.findUnique({ where: { id } });

    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (err: any) {
    console.log("Error: ", err);
    return null;
  }
};

export function protectorResolver(customResolver): any {
  return function (root, args, context, info) {
    if (!context.signedInUser) {
      const query = info.operation.operation === "query";
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "Please signin first.",
        };
      }
    }
    return customResolver(root, args, context, info);
  };
}
