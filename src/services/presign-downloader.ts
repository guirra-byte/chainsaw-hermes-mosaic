import { S3 } from "aws-sdk";
import fs from "node:fs";
import { videosDir } from "../config/path.config";
import { prisma } from "../_shared/prisma/prisma";

interface IPresignDownloader {
  destineBucket: string;
  key: string;
}

const s3Client = new S3({
  endpoint: process.env.CLOUDFARE_ENDPOINT,
  accessKeyId: process.env.CLOUDFARE_ACCESS_KEY_ID ?? "",
  secretAccessKey: process.env.CLOUDFARE_SECRET_ACCESS_KEY ?? "",
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export class PresignDownloaderService {
  async execute(data: IPresignDownloader) {
    const params = {
      Bucket: data.destineBucket,
      Key: data.key,
    };

    const video = await prisma.video.findUnique({
      where: {
        r2Key: data.key,
      },
    });

    if (!video) {
      throw new Error("Video not found");
    }

    if (video.r2Key) {
      try {
        const path = `${videosDir}/${video.id}/${video.id}.${video.mimetype}`;
        const destination = fs.createWriteStream(path);
        const readStream = s3Client
          .getObject(params)
          .createReadStream()
          .pipe(destination);

        // Processamento em Lotes;
        readStream.on("finish", async () => {
          const dispatchDestine = new Worker("./services/shortify-videos.ts");
          dispatchDestine.postMessage({
            originalFilename: video.originalFilename,
            mimetype: video.mimetype,
            filepath: path,
          });
        });
      } catch (error) {
        throw error;
      }
    }
  }
}
