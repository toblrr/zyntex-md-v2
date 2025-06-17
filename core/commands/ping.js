const { newCommand } = require("../handler/config");
const fetch = require("node-fetch")

newCommand("ping", async (zyn, id, userName, args, ctx) => {
  await ctx.read();
  await ctx.type();
  await ctx.react("📍");

  try{
    const start = Date.now()
    await fetch("https://www.google.com")
    const end = Date.now()
    await ctx.reply('```' + `Pong ${end-start}ms` + '```')
  }catch(err){
    await ctx.reply(err)
  }
},{description: "Pings the server."})