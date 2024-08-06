import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "../lib/r2";

interface IFile {
  id: string;
  props: { originalFilename: string; size: number; name?: string };
}

interface IPresignedUrl {
  requesterId: string;
  file: IFile;
}

interface ICloudfareUpload {
  presignedUrl: string;
  file: IFile;
}

export class UploadPresignUrlService {
  async execute(data: IPresignedUrl[]) {
    // Predefined endpoint to listen upload finished/error event in destine bucket (webhook);
    const destineBucket = process.env.R2_UPLOAD_BUCKET ?? "";
    const presignedUrls: Record<string, ICloudfareUpload[]> = {};
    for (const toPresign of data) {
      const mimetype = toPresign.file.props.originalFilename.split(".")[1];
      const presign = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: destineBucket,
          Key: toPresign.file.id,
          ContentType: `video/${mimetype}`,
        })
      );

      const tmpData: ICloudfareUpload = {
        presignedUrl: presign,
        file: toPresign.file,
      };

      if (!presignedUrls[destineBucket]) {
        presignedUrls[destineBucket] = [tmpData];
      } else {
        presignedUrls[destineBucket].push(tmpData);
      }
    }

    //CREATE MANY presignedUrls on db before return;
    return presignedUrls;
  }
}
