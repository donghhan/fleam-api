export const connectHashtags = (caption: string) => {
  const hashtags = caption.match(/#[\u0E00-\u0E7Fa-zA-Z]+/g) || [];
  return hashtags?.map((hashtag: string) => ({
    where: { hashtag },
    create: { hashtag },
  }));
};
