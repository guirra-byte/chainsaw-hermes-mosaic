-- CreateTable
CREATE TABLE "Transcription" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "presigned_url" TEXT,
    "presigned_url_expired" BOOLEAN NOT NULL DEFAULT false,
    "r2_bucket_name" TEXT,
    "r2_key" TEXT,
    "video_id" TEXT NOT NULL,

    CONSTRAINT "Transcription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "presigned_url" TEXT,
    "presigned_url_expired" BOOLEAN NOT NULL DEFAULT false,
    "r2_bucket_name" TEXT,
    "r2_key" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Short" (
    "id" SERIAL NOT NULL,
    "original_video_id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "Short_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_filename_key" ON "Transcription"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_presigned_url_key" ON "Transcription"("presigned_url");

-- CreateIndex
CREATE UNIQUE INDEX "Transcription_r2_key_key" ON "Transcription"("r2_key");

-- CreateIndex
CREATE UNIQUE INDEX "Video_original_filename_key" ON "Video"("original_filename");

-- CreateIndex
CREATE UNIQUE INDEX "Video_presigned_url_key" ON "Video"("presigned_url");

-- CreateIndex
CREATE UNIQUE INDEX "Video_r2_key_key" ON "Video"("r2_key");

-- CreateIndex
CREATE UNIQUE INDEX "Short_filename_key" ON "Short"("filename");

-- AddForeignKey
ALTER TABLE "Transcription" ADD CONSTRAINT "Transcription_video_id_fkey" FOREIGN KEY ("video_id") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Short" ADD CONSTRAINT "Short_original_video_id_fkey" FOREIGN KEY ("original_video_id") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
