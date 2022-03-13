import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";

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
    let hashtagObj = [];

    // RegEx for hashtags
    if (caption) {
      const hashtags = caption.match(/#[\u0E00-\u0E7Fa-zA-Z]+/g);
      hashtagObj = hashtags.map((hashtag: string) => ({
        where: { hashtag },
        create: { hashtag },
      }));
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
