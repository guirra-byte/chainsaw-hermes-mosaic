import path from "node:path";

const uploadDir = path.join(__dirname, "../../tmp/videos");
const audioDir = path.join(__dirname, "../../tmp/audio");
const videosDir = path.join(__dirname, "../../tmp/videos");
const transcriptionDir = path.join(__dirname, "../../tmp/json");

export { uploadDir, audioDir, videosDir, transcriptionDir };
