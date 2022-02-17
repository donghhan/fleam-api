import jwt from "jsonwebtoken";
import client from "../client";
import { FLEAM_SECRET_KEY } from "./keys";
import { JwtPayload } from "./interface";

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

export const protectorResolver = (user: any) => {
  if (!user) {
    throw new Error("You should signin first.");
  }
};
