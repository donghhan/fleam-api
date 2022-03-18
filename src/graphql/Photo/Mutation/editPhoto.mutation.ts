import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { connectHashtags } from "../Photo.utils";
import { protectorResolver } from "../../../utils/user.utils";

// Edit Photo Mutation
export const EditPhotoMutation = mutationField("editPhoto", {
  type: "GlobalResult",
  description: "Edit Photo Mutation",
  args: {
    id: nonNull(stringArg()),
    caption: nonNull(stringArg()),
  },
  async resolve(_, { id, caption }, { signedInUser }) {
    const oldPhoto = await client.photo.findFirst({
      where: { id, userId: signedInUser.id },
      include: { hashtags: { select: { hashtag: true } } },
    });

    if (!oldPhoto) {
      return {
        ok: false,
        error: "Photo not found. ",
      };
    }

    const updatedPhoto = await client.photo.update({
      where: { id },
      data: {
        caption,
        hashtags: {
          disconnect: oldPhoto.hashtags,
          connectOrCreate: connectHashtags(caption),
        },
      },
    });

    return {
      ok: true,
    };
  },
});
