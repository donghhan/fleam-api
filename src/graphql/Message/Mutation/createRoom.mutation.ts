import { nonNull, stringArg, mutationField, arg } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// sendMessage Mutation
export const SendMessageMutation = mutationField("sendMessage", {
  type: "GlobalResult",
  description: "Send Message Mutation",
  args: {
    payload: nonNull(stringArg()),
    chatRoomId: stringArg(),
    userId: stringArg(),
  },
  resolve: protectorResolver(
    async (_, { payload, chatRoomId, userId }, { signedInUser }) => {
      let chatRoom = null;
      // Find if user exists
      if (userId) {
        const user = await client.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });

        // Fails to find user
        if (!user) {
          return {
            ok: false,
            error: "This user does not exist.",
          };
        }

        chatRoom = await client.chatRoom.create({
          data: {
            users: {
              connect: [
                {
                  id: userId,
                },
                {
                  id: signedInUser,
                },
              ],
            },
          },
        });
      } else if (chatRoomId) {
        chatRoom = await client.chatRoom.findUnique({
          where: {
            id: chatRoomId,
          },
          select: {
            id: true,
          },
        });
        if (!chatRoom) {
          return {
            ok: false,
            error: "Room not found.",
          };
        }
      }

      await client.message.create({
        data: {
          payload,
          room: {
            connect: {
              id: chatRoom?.id,
            },
          },
          user: {
            connect: {
              id: signedInUser.id,
            },
          },
        },
      });

      return {
        ok: true,
      };
    }
  ),
});
