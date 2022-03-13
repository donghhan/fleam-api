import { Photo } from "./../../../../node_modules/.prisma/client/index.d";
import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";

// Create Comment Mutation
export const CreateCommentMutation = mutationField("createComment", {
  type: "CreateCommentResult",
  args: {
    photoId: nonNull(stringArg()),
    payload: nonNull(stringArg()),
  },
  async resolve(_, { photoId, payload }, { protectorResolver, signedInUser }) {
    protectorResolver(signedInUser);

    const ok = await client.photo.findUnique({
      where: { id: photoId },
      select: { id: true },
    });

    if (!ok) {
      return {
        ok: false,
        error: "Photo is not found.",
      };
    }

    await client.comment.create({
      data: {
        payload,
        photo: {
          connect: {
            id: photoId,
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
  },
});
