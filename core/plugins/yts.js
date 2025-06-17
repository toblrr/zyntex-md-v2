const { newCommand } = require("../handler/config");
const yts = require("yt-search");

newCommand(
  "yts",
  async (zyn, id, userName, args, ctx, prefix) => {
    await ctx.read();
    await ctx.type();
    await ctx.react("🍭");

    if (!args[0]) {
      return await ctx.errorMsg("Need a Query/Url!", "yts", "Query/Url");
    }

    try {
      if (!args[0].includes("https://youtube.com/watch?v=")) {
        const res = await yts(args[0]);
        const r = res.videos;
        const videos = r
          .slice(0, 20)
          .map((video, i) => {
            return `*${i + 1}. ${video.title}*\n_Url: ${video.url}_\n`;
          })
          .join("\n");
        const msg = `_Search results for '${query}'._\n\n\n${videos}

                        _For downloading:_ 
                            _${prefix}yta <Copied Url> (For audio)._ 
                            _${prefix}ytv <Copied Url> (For video)._ 

                        _${prefix}yts <Copied Url> (Gets you more information about the video)._ 

                        _Note: Videos/Audios larger than 100MB is not sent._`;

        await ctx.reply(msg);
      } else if (args[0].includes("https://youtube.com/watch?v=")) {
        const videoId = input.split("v=")[1].split("&")[0];
        const res = await yts({ videoId });
        let cap = `•ᴛɪᴛʟᴇ: *${res.title}* \n\n •ᴜʀʟ: *${res.url}* \n\n •ᴅᴜʀᴀᴛɪᴏɴ: *${res.timestamp}* \n\n •ᴠɪᴇᴡꜱ: *${res.views}* \n\n •ᴀᴜᴛʜᴏʀ: *${res.author.name}* \n\n •ᴜᴘʟᴏᴀᴅᴇᴅ: *${res.ago}* \n\n •ᴜᴘʟᴏᴀᴅᴇᴅ ᴅᴀᴛᴇ: *${res.uploadDate}* \n\n •ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ: \n _ ${res.description} _ `;
        await ctx.sendImage(res.thumbnail, cap);
      }
    } catch (err) {
      await ctx.reply(err);
    }
  },
  {
    description: "Search YouTube.",
  }
);
