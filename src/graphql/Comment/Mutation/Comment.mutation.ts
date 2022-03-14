import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// Create Comment Mutation
export const CreateCommentMutation = mutationField("createComment", {
  type: "GlobalResult",
  args: {
    photoId: nonNull(stringArg()),
    payload: nonNull(stringArg()),
  },
  resolve: protectorResolver(
    async (_, { photoId, payload }, { signedInUser }) => {
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
    }
  ),
});

// Delete Comment Mutation
export const DeleteCommentMutation = mutationField("deleteComment", {
  type: "GlobalResult",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: protectorResolver(async (_, { id }, { signedInUser }) => {
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
  }),
});

// Edit Comment Mutation
export const EditCommentMutation = mutationField("editComment", {
  type: "GlobalResult",
  args: {
    id: nonNull(stringArg()),
    payload: nonNull(stringArg()),
  },
  async resolve(_, { id, payload }, { signedInUser }) {
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
        error: "You are not authorized to edit comment.",
      };
    } else {
      await client.comment.update({
        where: {
          id,
        },
        data: {
          payload,
        },
      });
      return {
        ok: true,
      };
    }
  },
});
