import jwt from "jsonwebtoken";
import client from "../client";
import { FLEAM_SECRET_KEY } from "./keys";
import { JwtPayload } from "./interface";

export const getUser = async (token: any) => {
  try {
    if (!token) {
      return null;
    }

    const { id } = await jwt.verify(token, FLEAM_SECRET_KEY);
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
