import { Router, Request, Response } from "express";
import formidable from "formidable";
import { uploadDir } from "./config/path.config";
import { Worker } from "node:worker_threads";

export const router = Router();
interface AppFile {
  filepath: string;
  newFilename: string;
  originalFilename: string;
  mimetype: string;
  hashAlgorithm: boolean;
  size: number;
}

interface RequestFile {
  mosaic: {
    filepath: string;
    newFilename: string;
    originalFilename: string;
    mimetype: string;
    hashAlgorithm: boolean;
    size: number;
  }[];
}

const WORKERS: Worker[] = [];
async function loadBalance(index: number, array: Worker[]) {
  return function () {
    if (index >= array.length) index = 0;
    return array[index++];
  };
}

async function workersPool(array: Worker[], pathname: string, copies: number) {
  for (let index = 0; index <= copies; index++) {
    array.push(new Worker(pathname));
  }
}

router.post("/mosaic", async (request: Request, response: Response) => {
  formidable({
    maxTotalFileSize: 200 * 1024 * 1024 * 10,
    multiples: true,
    maxFiles: 20,
  }).parse(request, (err, field, files) => {
    if (err) return response.status(500).json({ error: err.message });
    if (files) {
      const upcommingFiles: RequestFile = JSON.parse(JSON.stringify(files));
      const availableFiles: AppFile[] = [];
      for (const file of upcommingFiles.mosaic) {
        if (file.mimetype === "video/mp4" || file.mimetype === "video/mov") {
          availableFiles.push(file);
        }
      }

      if (availableFiles.length > 0) {
        const copies = Math.floor(availableFiles.length / 2);
        workersPool(WORKERS, "./services/shortify-videos.ts", copies);
      }

      return response.status(202).end();
    }
  });
});

export { loadBalance, workersPool, AppFile };
