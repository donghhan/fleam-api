import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { connectHashtags } from "../Photo.utils";
import { protectorResolver } from "../../../utils/user.utils";

// Upload photo Mutation
export const UploadPhotoMutation = mutationField("uploadPhoto", {
  type: "Photo",
  description: "Upload Photo Mutation",
  args: {
    file: nonNull(stringArg()),
    caption: stringArg(),
  },
  resolve: protectorResolver((_, { file, caption }, { signedInUser }) => {
    let hashtagObj: any = [];

    // RegEx for hashtags
    if (caption) {
      hashtagObj = connectHashtags(caption);
    }

    return client.photo.create({
      data: {
        file,
        caption,
        user: {
          connect: {
            id: signedInUser.id,
          },
        },
        ...(hashtagObj.length > 0 && {
          hashtags: { connectOrCreate: hashtagObj },
        }),
      },
    });
  }),
});

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

// Delete Photo Query
export const DeletePhotoMutation = mutationField("deletePhoto", {
  type: "GlobalResult",
  args: {
    id: nonNull(stringArg()),
  },
  resolve: protectorResolver(async (_, { id }, { signedInUser }) => {
    const photo = await client.photo.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!photo) {
      return {
        ok: false,
        error: "Photo not found.",
      };
    } else if (photo.userId !== signedInUser.id) {
      return {
        ok: false,
        error: "You are not authorized to change photo",
      };
    } else {
      await client.photo.delete({ where: { id } });
      return {
        ok: true,
      };
    }
  }),
});
