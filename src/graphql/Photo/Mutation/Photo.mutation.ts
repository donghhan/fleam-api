import { mutationField, nonNull, stringArg, arg } from "nexus";
import client from "../../../client";

// Upload photo Mutation
export const UploadPhotoMutation = mutationField("uploadPhoto", {
  type: "Photo",
  description: "Upload Photo Mutation",
  args: {
    file: stringArg(),
    caption: stringArg(),
  },
  async resolve(_, { file, caption }, { signedInUser, protectorResolver }) {
    protectorResolver(signedInUser);
    let hashtagObjs: Array<string> = [];

    // RegEx for hashtags
    if (caption) {
      const hashtags = caption.match(/#[\u0E00-\u0E7Fa-zA-Z]+/g);
      const hashtagObjs = hashtags.map((hashtag: string) => ({
        where: { hashtag },
        create: { hashtag },
      }));
      console.log(hashtagObjs);
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
        ...(hashtagObjs.length > 0 && {
          hashtags: { connectOrCreate: hashtagObjs },
        }),
      },
    });
  },
});
