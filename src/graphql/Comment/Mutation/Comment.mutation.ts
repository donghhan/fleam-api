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

// Delete Comment Query
export const DeleteCommentMutation = mutationField("deleteComment", {
  type: "DeleteCommentResult",
  args: {
    id: nonNull(stringArg()),
  },
  async resolve(_, { id }, { protectorResolver, signedInUser }) {
    protectorResolver(signedInUser);

    const comment = await client.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!comment) {
      return {
        ok: false,
        error: "Comment not found.",
      };
    } else if (comment.userId !== signedInUser.id) {
      return {
        ok: false,
        error: "You are not authorized to change photo",
      };
    } else {
      await client.comment.delete({ where: { id } });
      return {
        ok: true,
      };
    }
  },
});
