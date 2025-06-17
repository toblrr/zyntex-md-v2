const { newCommand } = require("../handler/config");
const yts = require("yt-search");
const {ytmp4} = require("ruhend-scraper")

newCommand("video", async (zyn, id, userName, args, ctx) => {
  await ctx.read();
  await ctx.type();
  await ctx.react("🎦");

  if (!args[0] || args[0].includes("https://youtube.com/watch?v=")) {
    return ctx.errorMsg("Need a Query!", "video", "Query");
  }
  try{
    yts(args[0]).then( async(res) => {
    const url = res.videos[0].url
    await ctx.reply("_*Downloading...*_\n" + "_" + res.videos[0].title+ "_");
    const data = await ytmp4(url)
    await ctx.sendVideo(data.video , "```" + data.title + "```")
      
  })
  }catch(err){
    return await ctx.reply(err)
  }
},{description: "Downloads videos from YouTube."})


