import { mutationField, nonNull, arg, stringArg } from "nexus";
import client from "../../../client";
import { connectHashtags } from "../Photo.utils";
import { protectorResolver } from "../../../utils/user.utils";
import { uploadPhoto } from "../../../utils/public.utils";

// Upload photo Mutation
export const UploadPhotoMutation = mutationField("uploadPhoto", {
  type: "Photo",
  description: "Upload Photo Mutation",
  args: {
    file: nonNull(arg({ type: "Upload" })),
    caption: stringArg(),
  },
  resolve: protectorResolver(async (_, { file, caption }, { signedInUser }) => {
    let hashtagObj: any = [];

    // RegEx for hashtags
    if (caption) {
      hashtagObj = connectHashtags(caption);
    }

    // S3 File URL
    const fileURL = await uploadPhoto(file, signedInUser.id, "uploads");

    return client.photo.create({
      data: {
        file: fileURL,
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
