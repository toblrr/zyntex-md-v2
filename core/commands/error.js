const { newCommand } = require("../handler/config");

newCommand("error", async (zyn, id, userName, args, ctx) => {
  await ctx.read();
  await ctx.type();
  await ctx.react("🧰");

  if (!args[0]) {
    return ctx.errorMsg("Need a Query!", "error", "Query");
  }
  let bot = zyn.user.id;
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let h = new Date().getHours();
  let m = new Date().getMinutes();
  let s = new Date().getSeconds();
  const i = `${bot} , ${date}/${month}/${year} , ${h};${m};${s}`;
  const msg = `*Error[${i}]:* ` + "```" + args[0] + "```";

  await zyn
    .sendMessage("916282888139@s.whatsapp.net", { text: msg })
    .then(
      ctx.reply(
        "*Thank you for describing your error!* \n*Your error has been sent to admin.*"
      )
    );
},{description: "Sends error to admins."});
