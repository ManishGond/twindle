// utils/b2.ts
import {
  S3Client,
  PutObjectCommandInput,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";

dotenv.config();

const s3Client = new S3Client({
  region: "us-east-005",
  endpoint: "https://s3.us-east-005.backblazeb2.com",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APP_KEY!,
  },
  forcePathStyle: true,
});

export const uploadToB2 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  const uploadParams: PutObjectCommandInput = {
    Bucket: process.env.B2_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const upload = new Upload({
    client: s3Client,
    params: uploadParams,
  });

  const result = await upload.done();

  return `https://${process.env.B2_BUCKET_NAME}.s3.us-east-005.backblazeb2.com/${fileName}`;
};
