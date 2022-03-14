import { queryField, list, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// seeRoom Query
export const SeeRoomQuery = queryField("seeRoom", {
  type: "ChatRoom",
  description: "See Room Query",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: protectorResolver((_, { id }, { signedInUser }) => {
    // Finding a chat room with its ID and in which signed in users are.
    client.chatRoom.findFirst({
      where: { id, users: { some: { id: signedInUser.id } } },
    });
  }),
});
