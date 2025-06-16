const { newCommand } = require("../handler/config");
const { downloadMediaMessage } = require("baileys");
const fs = require("fs");
const path = require("path");
const { tmpdir } = require("os");
const { exec } = require("child_process");
const { unlink } = require("fs/promises");

function execPromise(cmd) {
  return new Promise((res, rej) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) rej(err);
      else res(stdout || stderr);
    });
  });
}

newCommand("sticker", async (zyn, id, userName, args, ctx, m) => {
  await ctx.read();
  await ctx.react("🌀");

  const msg = m.messages[0];
  const isImage = !!(msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage);
  const isVideo = !!(msg.message?.videoMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage);

  const mediaMsg = msg.message?.imageMessage ||
    msg.message?.videoMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

  if (!mediaMsg) {
    return await ctx.reply("❌ Please send or reply to an image or short video.");
  }

  const type = isVideo ? "videoMessage" : "imageMessage";

  const buffer = await downloadMediaMessage(
    { message: { [type]: mediaMsg } },
    "buffer",
    {},
    {
      logger: undefined,
      reuploadRequest: zyn.updateMediaMessage,
    }
  );

  const inputPath = path.join(tmpdir(), isVideo ? "input.mp4" : "input.jpg");
  const outputPath = path.join(tmpdir(), "output.webp");
  fs.writeFileSync(inputPath, buffer);

  try {
    const cmd = isVideo
      ? `ffmpeg -i "${inputPath}" -vcodec libwebp -filter:v fps=15 -loop 0 -ss 0 -t 10 -preset default -an -vsync 0 -s 512:512 -y "${outputPath}"`
      : `ffmpeg -i "${inputPath}" -vcodec libwebp -filter:v fps=15 -lossless 1 -q:v 80 -loop 0 -an -preset default -y "${outputPath}"`;

    await execPromise(cmd);

    await zyn.sendMessage(id, {
      sticker: { url: outputPath },
    }, { quoted: msg });

  } catch (err) {
    console.error("❌ Sticker error:", err);
    await ctx.reply("❌ Could not create sticker.");
  } finally {
    if (fs.existsSync(inputPath)) await unlink(inputPath);
    if (fs.existsSync(outputPath)) await unlink(outputPath);
  }
}, {
  description: "Convert image/video to sticker"
}); 