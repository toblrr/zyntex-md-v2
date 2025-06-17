const { getCommand } = require("./config");
const { buildContext } = require("./utils");

const prefix = process.env.BOT_PREFIX || '.'
let botName = "𝙕𝙮𝙣𝙩3𝙭!"; 

async function messageHandler(zyn, m) {
  const { messages } = m;
  const q = messages[0];
  if (!q.message) return;

  const id = q.key.remoteJid;
  const pushName = q.pushName;

  // Get message text from any possible type
  const msgContent =
    q.message?.conversation ||
    q.message?.extendedTextMessage?.text ||
    q.message?.imageMessage?.caption ||
    q.message?.videoMessage?.caption ||
    "";

  if (!msgContent.startsWith(prefix)) return;

  const body = msgContent.slice(prefix.length).trim();
  const args = body.split(/\s+/);

  const commandName = args.shift().toLowerCase();

  const commandObj = getCommand(commandName);
  if (!commandObj || typeof commandObj.handler !== "function") {
    console.error(`❌ Invalid command or handler for: ${commandName}`);
    return;
  }
  const context = buildContext(zyn, q, id, prefix);

  try {
    await commandObj.handler(zyn, id, pushName, args, context, m , botName , prefix);
  } catch (err) {
    console.error("❌ Command Error:", err);
    await zyn.sendMessage(
      id,
      {
        text: "❌ An error occurred while executing the command.",
      },
      { quoted: q }
    );
  }
}
module.exports = {
  messageHandler,
};
