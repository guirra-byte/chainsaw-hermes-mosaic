import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();
export const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFARE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFARE_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.CLOUDFARE_SECRET_ACCESS_KEY ?? '',
  },
});
