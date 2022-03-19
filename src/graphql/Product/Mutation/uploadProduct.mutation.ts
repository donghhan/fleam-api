import {
  nonNull,
  stringArg,
  mutationField,
  arg,
  intArg,
  booleanArg,
  floatArg,
  list,
} from "nexus";
import client from "../../../client";
import { protectorResolver } from "../../../utils/user.utils";

// Making Hashtags
const connectHashtags = (description: string) => {
  const hashtags = description.match(/#[\u0E00-\u0E7Fa-zA-Z]+/g) || [];
  return hashtags?.map((hashtag: string) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};

// Upload Product Mutation
export const UploadProductMutation = mutationField("uploadProduct", {
  type: "Product",
  description: "Upload Product Mutation",
  args: {
    file: nonNull(list(stringArg())),
    condition: nonNull(stringArg()),
    price: nonNull(floatArg()),
    discountPrice: floatArg(),
    color: nonNull(stringArg()),
    size: stringArg(),
    description: nonNull(stringArg()),
    age: intArg(),
    brand: stringArg(),
    category: nonNull(stringArg()),
    isFreeShipping: nonNull(booleanArg()),
    domesticShippingCharge: floatArg(),
    isWorldWideShipping: nonNull(booleanArg()),
    worldwideShippingCharge: floatArg(),
    location: nonNull(stringArg()),
    photos: list(nonNull(stringArg())),
  },
  resolve: protectorResolver(
    async (
      _,
      {
        photos,
        description,
        size,
        color,
        price,
        category,
        isFreeShipping,
        isWorldWideShipping,
        location,
        condition,
      },
      { signedInUser }
    ) => {
      let hashtagObj: any | null = [];

      // Parse description and get or create hashtags
      if (description) {
        hashtagObj = connectHashtags(description);
      }

      return client.product.create({
        data: {
          photos,
          description,
          size,
          color,
          price,
          category,
          isFreeShipping,
          isWorldWideShipping,
          location,
          condition,
          user: {
            connect: {
              id: signedInUser.id,
            },
          },
          ...(hashtagObj.length > 0 && {
            hashtags: {
              connectOrCreate: hashtagObj,
            },
          }),
        },
      });
    }
  ),
});
