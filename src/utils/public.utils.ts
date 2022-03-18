import AWS from "aws-sdk";

AWS.config.update({
  credentials: {
    accessKeyId: String(process.env.AWS_ACCESS_KEY),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
  },
});

export const uploadPhoto = async (
  file: any,
  id?: string,
  folderName?: string
) => {
  const { fileName, createReadStream } = await file;
  const readStream = createReadStream();
  const saveName = `${folderName}/${id}-${Date.now()}-${fileName}`;
  const { Location } = await new AWS.S3()
    .upload({
      Bucket: "fleam-image-upload",
      Key: saveName,
      ACL: "public-read-write",
      Body: readStream,
    })
    .promise();
  return Location;
};
