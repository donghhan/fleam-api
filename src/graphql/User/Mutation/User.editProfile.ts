import { createWriteStream } from "fs";
import { stringArg, mutationField, arg } from "nexus";
import bcrypt from "bcrypt";
import { uploadPhoto } from "../../../utils/public.utils";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// editProfile Mutation
export const EditProfileMutation = mutationField("editProfile", {
  type: "GlobalResult",
  args: {
    firstName: stringArg(),
    email: stringArg(),
    password: stringArg(),
    bio: stringArg(),
    avatar: arg({ type: "Upload" }),
  },
  resolve: protectorResolver(
    async (
      _,
      { firstName, email, password: newPassword, bio, avatar },
      { signedInUser }
    ) => {
      let avatarUrl: string | null = null;
      let hashedPassword: string | null = null;

      if (avatar) {
        avatarUrl = await uploadPhoto(avatar, signedInUser.id, "avatars");
        // const { filename, createReadStream } = await avatar;
        // const newFilename = `${signedInUser.id}-${filename}`;
        // const readStream = createReadStream();
        // const writeStream = createWriteStream(
        //   process.cwd() + "/uploads/" + filename
        // );
        // readStream.pipe(writeStream);
        // avatarUrl = `http://localhost:4500/graphql/static/${newFilename}`;
      }

      if (newPassword) {
        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      const updateComplete = await client.user.update({
        where: { id: signedInUser.id },
        data: {
          firstName,
          email,
          bio,
          ...(hashedPassword && { password: hashedPassword }),
          ...(avatarUrl && { avatar: avatarUrl }),
        },
      });

      if (updateComplete.id) {
        return {
          ok: true,
        };
      } else {
        return { ok: false, error: "Could not update profile." };
      }
    }
  ),
});
