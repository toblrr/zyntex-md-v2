const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  requestPairingCode,
} = require("baileys");
let { Boom } = require("@hapi/boom");
const fs = require("fs");
require("dotenv").config();
const c = require("ansi-colors");
var figlet = require("figlet");
const { default: pino } = require("pino");
const CryptoJS = require("crypto-js");
const qrcode = require("qrcode-terminal");

const { messageHandler } = require("./core/handler/msghandler.js");
const path = require("path"); 

let botName = "𝙕𝙮𝙣𝙩3𝙭!";
const prefix = process.env.BOT_PREFIX || ".";
if (
  process.env.OWNER_NUMBER === undefined ||
  process.env.OWNER_NUMBER === "" ||
  !process.env.OWNER_NUMBER.startsWith("+")
) {
  console.log(
    c.redBright.italic(
      "Plaese set a appropriate value on your .env file for OWNER_NUMBER"
    )
  );
  return;
}
var ownerNumber = process.env.OWNER_NUMBER;

figlet.text(
  "ZYNTEX-MD",
  {
    font: "Cybermedium",
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: true,
  },
  function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(c.red.bold(data));
    console.log(
      c.gray.bold(`------------------------------------------------`)
    );
  }
);
// if (process.env.SESSION_ID === undefined) {
//   console.log(c.red("No session ID found in .env file"));
// } else if (!process.env.SESSION_ID.startsWith("Zynt3x:::")) {
//   console.log(c.red("Session ID is not valid!"));
// }
const sessionFile = "./session";
// const data = process.env.SESSION_ID;
// const ciphertext = data.slice(9);
// var bytes = CryptoJS.AES.decrypt(ciphertext, "Zynt3x!");
// var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
// const t = JSON.stringify(decryptedData);
// let file = fs.createWriteStream("./session/creds.json");
// file.write(t);

// fs.writeFile("./session/creds.json", function (err) {
//   if (err) throw err;
//   console.log("SESSION FILE CREATED");
// });

async function zyntex() {
  const { state, saveCreds } = await useMultiFileAuthState(sessionFile);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(
    c.blue.italic(`Baileys Version: ${version}\nIs Latest: ${isLatest}`)
  );
  console.log(c.gray.bold(`------------------------------------------------`));

  const zyn = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    auth: state,
  });

  zyn.ev.on("connection.update", async (tex) => {
    // const qr = [tex.qr];
    // if (qr) {
    //   qr.forEach((data, index) => {
    //     console.log(`\nQR Code ${index + 1}:\n`);
    //     qrcode.generate(String(data), { small: true });
    //   });
    // }

    let { lastDisconnect, connection } = tex;
    if (connection === "connecting") {
      console.log(c.green("Connecting to Whatsapp..."));
    }
    if (connection === "open") {
      await zyn.sendMessage(zyn.user.id, {
        text:
          "*BOT STARTED SUCCESSFULLY!*\nPrefix: " +
          `${prefix}` +
          "\n\n _Thanks For Using Zynt3x - MD_",
      });
      console.log(c.green("Successfully connected to Whatsapp!"));
      console.log(c.green("\n\nBOT STARTED SUCCESSFULLY!"));
    }
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          c.red(`Bad Session!, Please Delete ${sessionFile} and Scan Again`)
        );
        zyn.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log(c.blue("Connection closed!, reconnecting...."));
        zyntex();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log(c.blue("Connection Lost from Server!, Reconnecting..."));
        zyntex();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          c.green(
            "Connection Replaced!, Another Session Opened, Please Close Current Session"
          )
        );
        if (zyn?.user) await zyn.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          c.red(
            `Device Logged Out, Please Delete '${sessionFile}' and Scan Again.`
          )
        );
        zyn.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log(c.green("Restart Required, Restarting..."));
        zyntex();
      } else if (reason === DisconnectReason.timedOut) {
        console.log(
          c.red("Connection TimedOut,") + c.green(" Reconnecting...")
        );
        zyntex();
      } else {
        zyn.end(c.red(`DisconnectReason: ${reason}|${lastDisconnect.error}`));
      }
    }
  });

  const commandsPath = path.join(__dirname, "/core/commands");
    fs.readdirSync(commandsPath).forEach((file) => {
    const fullPath = path.join(commandsPath, file);
    if (file.endsWith(".js")) {
      require(fullPath);
    }
  });
  const pluginDir = path.join(__dirname, "/core/plugins");
  fs.readdirSync(pluginDir).forEach((file) => {
    if (file.endsWith(".js")) {
      require(path.join(pluginDir, file));

    }
  });

  zyn.ev.on("messages.upsert", async (m) => {
    await messageHandler(zyn, m);
  });

  //   if (body.startsWith(prefix + "yts")) {
  //     read(), type(), react("🍭");
  //     const query = body.slice(5);
  //     if (!query) {
  //       errorMsg("Need a Query or a Youtube video Url", "yts", "Query/Url");
  //     } else if (!query.includes("https://youtube.com/watch?v=")) {
  //       try {
  //         yts(query).then((res) => {
  //           const r = res.videos;
  //           var msg = `_Search results for '${query}'._\n\n\n *1. ${r[0].title}* \n _Url: ${r[0].url}_ \n\n *2. ${r[1].title}* \n _Url: ${r[1].url}_ \n\n *3. ${r[2].title}* \n _Url: ${r[2].url}_ \n\n *4. ${r[3].title}* \n _Url: ${r[3].url}_ \n\n *5. ${r[4].title}* \n _Url: ${r[4].url}_ \n\n *6. ${r[5].title}* \n _Url: ${r[5].url}_ \n\n *7. ${r[6].title}* \n _Url: ${r[6].url}_ \n\n *8. ${r[7].title}* \n _Url: ${r[7].url}_ \n\n *9. ${r[8].title}* \n _Url: ${r[8].url}_ \n\n *10. ${r[9].title}* \n _Url: ${r[9].url}_ \n\n\n _For downloading:_ \n     _${prefix}yta <Copied Url> (For audio)._ \n     _${prefix}ytv <Copied Url> (For video)._ \n\n _${prefix}yts <Copied Url> (Gets you more information about the video)._ \n\n _Note: Videos/Audios larger than 100MB is not sent._`;
  //           reply(msg);
  //         });
  //       } catch (err) {
  //         reply("*An Error Occured!*\n" + `_*${err}*_`);
  //       }
  //     } else if (query.includes("https://youtube.com/watch?v=")) {
  //       const videoId = body.slice(5);
  //       const id = videoId.split("https://youtube.com/watch?v=");
  //       try {
  //         yts({ videoId: id[1] }).then((res) => {
  //           let cap = `•ᴛɪᴛʟᴇ: *${res.title}* \n\n •ᴜʀʟ: *${res.url}* \n\n •ᴅᴜʀᴀᴛɪᴏɴ: *${res.timestamp}* \n\n •ᴠɪᴇᴡꜱ: *${res.views}* \n\n •ᴀᴜᴛʜᴏʀ: *${res.author.name}* \n\n •ᴜᴘʟᴏᴀᴅᴇᴅ: *${res.ago}* \n\n •ᴜᴘʟᴏᴀᴅᴇᴅ ᴅᴀᴛᴇ: *${res.uploadDate}* \n\n •ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ: \n _ ${res.description} _ `;
  //           sendImage(res.thumbnail, cap);
  //         });
  //       } catch (err) {
  //         reply("*An Error Occured!*\n" + `_*${err}*_`);
  //       }
  //     }
  //   }


  zyn.ev.on("creds.update", saveCreds);
}
zyntex();
