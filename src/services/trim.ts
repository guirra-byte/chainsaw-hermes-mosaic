import { parentPort } from "node:worker_threads";
import ffmpeg from "fluent-ffmpeg";

interface Trim {
  path: {
    video: string;
    short: string;
  };
  time: {
    start: number;
    end: number;
  };
  out_format: string;
}

if (parentPort) {
  parentPort.on("message", (upcomming_msg) => {
    const data: Trim = JSON.parse(upcomming_msg);
    if (data) {
      const duration = data.time.end - data.time.start;
      ffmpeg(data.path.video)
        .setStartTime(data.time.start)
        .setDuration(duration)
        .outputOptions([
          "-vf",
          "scale=1080:1920:force_original_aspect_ratio=decrease",
          "-vf",
          "pad=1080:1920:(ow-iw)/2:(oh-ih)/2",
        ])
        .output(data.path.short)
        .toFormat(data.out_format)
        .on("end", () => {
          console.log("Corte do vídeo concluído.");
        })
        .on("error", (err) => {
          console.error("Erro ao cortar o vídeo:", err);
        })
        .run();
    }
  });
}
