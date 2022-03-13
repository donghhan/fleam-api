import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";

// Like Photo Mutation
export const LikePhotoMutation = mutationField("toggleLike", {
  type: "LikePhotoResult",
  description: "Like Photo Mutation",
  args: {
    id: nonNull(stringArg()),
  },
  async resolve(_, { id }, { signedInUser, protectorResolver }) {
    protectorResolver(signedInUser);

    const photo = await client.photo.findUnique({ where: { id } });

    if (!photo) {
      return {
        ok: false,
        error: "Cannnot like that photo.",
      };
    }

    const like = await client.like.findUnique({
      where: { photoId_userId: { userId: signedInUser.id, photoId: id } },
    });

    if (like) {
      await client.like.delete({
        where: { photoId_userId: { userId: signedInUser.id, photoId: id } },
      });
    } else {
      await client.like.create({
        data: {
          user: {
            connect: {
              id: signedInUser.id,
            },
          },
          photo: {
            connect: {
              id: photo.id,
            },
          },
        },
      });
    }
    return {
      ok: true,
    };
  },
});
