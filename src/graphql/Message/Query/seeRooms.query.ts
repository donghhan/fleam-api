import { queryField, list } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// seeRoom Query
export const SeeRoomsQuery = queryField("seeRooms", {
  type: list("ChatRoom"),
  description: "See Rooms Query",
  resolve: protectorResolver(async (_, __, { signedInUser }) => {
    return await client.chatRoom.findMany({
      where: { users: { some: { id: signedInUser.id } } },
    });
  }),
});
