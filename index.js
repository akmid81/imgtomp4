const fs = require("fs");
const path = require("path");
var videoshow = require("videoshow");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

function imgToMp4(imgFolder, mp4Path) {

   const images = fs
      .readdirSync(imgFolder)
      .map((fileName) => {
         return path.join(imgFolder, fileName);
      })
      .filter((file) => {
         return path.extname(file) === ".jpg" || ".png";
      })
      .sort();

   const videoOptions = {
      fps: 25,
      loop: 0.2, // seconds
      transition: false,
      videoBitrate: 2048,
      videoCodec: "libx264",
      size: "100%",
      format: "mp4",
      pixelFormat: "yuv420p",
   };

   videoshow(images, videoOptions)
      .save(mp4Path)
      .on("start", function (command) {
         console.log("ffmpeg process started:", command);
      })
      .on("error", function (err, stdout, stderr) {
         console.log("Error:", err);
         console.log("ffmpeg stderr:", stderr);
      })
      .on("end", function (output) {
         console.log("Video created in:", output);
      });
}

module.exports = imgToMp4;