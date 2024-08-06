import { parentPort, Worker } from "node:worker_threads";
import { audioDir, transcriptionDir, videosDir } from "../config/path.config";
import { nanoid } from "nanoid";
import Replicate from "replicate";
import fs from "node:fs";
import OpenAI from "openai";
import { additionalContext } from "../../template/training-file";
import { secondsToTime } from "../helpers/seconds-to-time";
import ffmpeg from "fluent-ffmpeg";
import dotenv from "dotenv";
import { workersPool } from "../helpers/workers-pool";
import { loadBalance } from "../helpers/load-balance";

dotenv.config();

interface Short {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface IVideo {
  originalFilename: string;
  filepath: string;
  mimetype: string;
}

async function dispatchToShortify(data: {
  shorts: Short[];
  video: {
    filepath: string;
    originalFilename: string;
    mimetype: string;
  };
}) {
  const videoPath = `${videosDir}/${data.video.originalFilename}`;
  fs.mkdir(videoPath, (err) => {
    if (err) throw err;
  });

  for (let borrow = 0; borrow < data.shorts.length; borrow++) {
    const prefix = nanoid();
    const short = data.shorts[borrow];
    const filenameTemplate = `${prefix}_${borrow}.${data.video.mimetype}`;

    const [startAt, endAt] = await Promise.all([
      secondsToTime(short.startTime),
      secondsToTime(short.endTime),
    ]);

    if (startAt && endAt) {
      return {
        filename: filenameTemplate,
        time: { start: startAt, end: endAt },
      };
    } else {
      throw new Error("Trim data format is not valid.");
    }
  }
}

// Concurrency with Worker Threads
async function extractAudio(audio_pathname: string, local_pathname: string) {
  ffmpeg(local_pathname)
    .audioCodec("pcm_s16le")
    .audioFrequency(44100)
    .toFormat("wav")
    .save(audio_pathname);

  return audio_pathname;
}

if (parentPort) {
  parentPort.on("message", async (msg: any) => {
    const data: IVideo = JSON.parse(msg);
    if (data) {
      const audioPathname = `${audioDir}/${nanoid()}`;
      const isolateAudio = await extractAudio(audioPathname, data.filepath);

      const MODEL_VERSION =
        "4f41e90243af171da918f04da3e526b2c247065583ea9b757f2071f573965408";
      const TRANSCRIPTION_MODEL = `turian/insanely-fast-whisper-with-video:${MODEL_VERSION}`;

      const replicate = new Replicate();
      await replicate
        .run(TRANSCRIPTION_MODEL, {
          input: {
            audio: isolateAudio,
          },
        })
        .then((reply) => {
          const transcriptionDest = `${transcriptionDir}/${nanoid()}.json`;
          const streamifyReply = fs.createWriteStream(transcriptionDest);
          streamifyReply.write(reply);

          streamifyReply.on("finish", async () => {
            const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
            const upload = await openai.files.create({
              file: fs.createReadStream(transcriptionDest),
              purpose: "fine-tune",
            });

            const fineTune = await openai.fineTuning.jobs.create({
              training_file: upload.filename,
              model: "gpt-3.5-turbo",
            });

            const content = additionalContext({
              id: fineTune.id,
              training_file: fineTune.training_file,
            });

            const completion = await openai.chat.completions.create({
              response_format: { type: "json_object" },
              messages: [
                {
                  role: "system",
                  content,
                },
              ],
              model: "gpt-3.5-turbo-1106",
            });

            const workers: Worker[] = [];
            let index = 0;
            for (const choice of completion.choices) {
              const { message } = choice;
              if (message.content) {
                const shortifyData: { shorts: Short[] } = JSON.parse(
                  message.content
                );

                if (workers.length === 0) {
                  const copies = Math.floor(
                    shortifyData.shorts.length * (10 / 100)
                  );

                  workersPool(workers, "./trim.ts", copies);
                }

                const trimData = await dispatchToShortify({
                  shorts: shortifyData.shorts,
                  video: {
                    filepath: data.filepath,
                    mimetype: data.mimetype,
                    originalFilename: data.originalFilename,
                  },
                });

                if (trimData) {
                  index += 1;
                  const dispatchTo = await loadBalance(index, workers);
                  dispatchTo().postMessage(JSON.stringify(trimData));
                }
              }
            }
          });
        })
        .catch((reason: any) => {
          if (reason) {
            throw new Error(
              `Replicate model run attempt failed; Reason ${reason}`
            );
          }
        });
    }
  });
}
