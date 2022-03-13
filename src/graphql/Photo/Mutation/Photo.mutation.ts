import { intArg, mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { connectHashtags } from "../Photo.utils";

// Upload photo Mutation
export const UploadPhotoMutation = mutationField("uploadPhoto", {
  type: "Photo",
  description: "Upload Photo Mutation",
  args: {
    file: nonNull(stringArg()),
    caption: stringArg(),
  },
  async resolve(_, { file, caption }, { signedInUser, protectorResolver }) {
    protectorResolver(signedInUser);
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
  },
});

// Edit Photo Mutation
export const EditPhotoMutation = mutationField("editPhoto", {
  type: "EditPhotoResult",
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
