const fs = require("fs");

const config = { SESSION_ID: process.env.SESSION_ID || "4e6bc1ab82", PREFIX: ".",

AUTO_READ_STATUS: "oui", AUTO_DOWNLOAD_STATUS: "oui",

BOT_NAME: "DEKU", MENU_THEME: "LUFFY",

PM_PERMIT: "oui", MODE_PUBLIC: "oui",

PRESENCE: "1",

OWNER_NAME: "deku", OWNER_NUMBER: "22782908895",

WARN_COUNT: 3,

STARTING_BOT_MESSAGE: "oui", PM_CHATBOT: "oui",

ANTI_COMMAND_SPAM: "oui", ANTI_DELETE_MESSAGE: "oui",

AUTO_REACT_MESSAGE: "oui", AUTO_REACT_STATUS: "oui",

TIME_ZONE: "Africa/Niamey",

SERVER: "railway",

STICKER_PACKNAME: "DEKU BOT" };

// Création automatique du fichier set.env let envContent = "";

for (const [key, value] of Object.entries(config)) { envContent += ${key}=${value}\n; }

fs.writeFileSync("set.env", envContent);

console.log("✅ Configuration DEKU chargée"); console.log("✅ SESSION_ID :", config.SESSION_ID);

try { require("./zokou/index.js"); } catch (err) { console.error("❌ Erreur :", err.message); }

