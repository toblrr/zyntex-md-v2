const { newCommand } = require("../handler/config");
const fetch = require("node-fetch")

newCommand("ping", async (zyn, id, userName, args, ctx) => {
  await ctx.read();
  await ctx.type();
  await ctx.react("📍");

  try{
    const start = performance.now()
    await fetch("www.google.com")
    const end = performance.now()
    return await ctx.reply(```Pong ${end-start}ms```)
  }catch(err){
    return await ctx.reply(err)
  }
},{description: "Pings the server."})