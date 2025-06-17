const { newCommand } = require('../handler/config');

newCommand("img", async (zyn, id, userName, args, ctx) => {
  await ctx.read();
  await ctx.type();
  await ctx.react("🪄");

  if(!args[0]){
    return await ctx.errorMsg("Need a Query!", "img", "Query")
  }

  ctx.reply("*Generating...*  🔄")
  await ctx.sendImage(`https://image.pollinations.ai/prompt/${args[0]}?nologo=1`, `\n> Made with ❤️ by "𝙕𝙮𝙣𝙩3𝙭!"`)

}, {
  description: "Create AI images."
});
