import { mutationField, nonNull, stringArg } from "nexus";
import client from "../../../client";
import { connectHashtags } from "../Photo.utils";
import { protectorResolver } from "../../../utils/user.utils";

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
