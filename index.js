const fs = require("fs");
const { spawnSync, spawn } = require("child_process");

const zokouEnv = {
  // Identifiant de session WhatsApp (lié à votre compte)
  SESSION_ID: "4e6bc1ab82",
  
  // Préfixe de commande utilisé pour déclencher le bot
  PREFIX: ".",
  
  // Si défini sur "oui", le bot verra automatiquement tous les statuts WhatsApp
  AUTO_READ_STATUS: "oui",
  
  // Si défini sur "oui", le bot téléchargera automatiquement tous les statuts WhatsApp
  AUTO_DOWNLOAD_STATUS: "oui",
  
  // Le nom affiché de votre bot
  BOT_NAME: "Zokou-MD",
  
  // Le thème visuel pour les menus du bot (nom prédéfini ou liens médias)
  MENU_THEME: "LUFFY",
  
  // Si "non", les commandes ne fonctionneront pas en privé pour les autres
  PM_PERMIT: "oui",
  
  // Si "oui", le bot est disponible pour tout le monde ; si "non", seul le propriétaire peut l'utiliser
  MODE_PUBLIC: "oui",
  
  // Contrôle l'activité visible du bot : 1 = en ligne, 2 = saisie, 3 = enregistrement, vide = réel
  PRESENCE: "1",
  
  // Votre nom affiché (nom du propriétaire)
  OWNER_NAME: "deku",
  
  // Votre numéro de téléphone au format international
  OWNER_NUMBER: "27782908895",
  
  // Nombre d'avertissements avant qu'un utilisateur ne soit sanctionné
  WARN_COUNT: 3,
  
  // Si "oui", le bot envoie un message de bienvenue au démarrage
  STARTING_BOT_MESSAGE: "oui",
  
  // Si "oui", le bot répond automatiquement aux messages privés
  PM_CHATBOT: "oui",
  
  // Si "oui", ajoute un délai entre les commandes pour éviter le spam
  ANTI_COMMAND_SPAM: "oui",
  
  // Si "oui", les messages supprimés par d'autres vous seront envoyés en privé
  ANTI_DELETE_MESSAGE: "oui",
  
  // Si "oui", le bot réagit automatiquement aux messages entrants
  AUTO_REACT_MESSAGE: "oui",
  
  // Si "oui", le bot réagit automatiquement aux statuts
  AUTO_REACT_STATUS: "oui",
  
  // Fuseau horaire utilisé par le bot
  TIME_ZONE: "Africa/Sao_Tome",
  
  // Environnement serveur utilisé (ex : HEROKU, VPS, etc.)
  SERVER: "vps",
  
  // Nom du pack de stickers utilisé par le bot
  STICKER_PACKNAME: "made with ❤; Zokou-MD",
};

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function cloneRepository() {
  const cloneResult = spawnSync("git", [
    "clone",
    "https://gitlab.com",
    "zokou",
  ]);

  if (cloneResult.error) {
    console.error("Error cloning repository:", cloneResult.error);
  }

  const envFile = "zokou/set.env";
  if (!fs.existsSync(envFile)) {
    for (const [key, value] of Object.entries(zokouEnv)) {
      value ? fs.appendFileSync(envFile, `${key}=${value}\n`) : null;
    }
  }
  installDependancies();
}

function installDependancies() {
  const result = spawnSync("npm", ["install"], {
    cwd: "zokou",
    stdio: "inherit",
    env: { ...process.env, CI: "true" },
  });
  if (result.error || result.status !== 0) {
    console.error("Error installing dependencies:", result.error);
    process.exit(1);
  }
}

function checkDependencies() {
  const result = spawnSync("npm", ["ls"], {
    cwd: "zokou",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.log("Some dependencies are missing or invalid.");
    installDependancies();
  } else {
    console.log("All dependencies are installed properly.");
  }
}

function startPm2() {
  const pm2 = spawn(
    "npx",
    ["pm2", "start", "index.js", "--name", "zokou", "--attach"],
    {
      cwd: "zokou",
      stdio: "inherit",
    }
  );

  pm2.on("exit", (code) => {
    if (code !== 0) console.error(`PM2 exited with code ${code}`);
  });

  pm2.on("error", (err) => {
    console.error("PM2 encountered an error:", err);
  });

  pm2?.stderr?.on("data", (data) => {
    console.log(data.toString());
  });

  pm2?.stdout?.on("data", (data) => {
    console.log(data.toString());
  });
}

if (!fs.existsSync("zokou")) {
  cloneRepository();
}
checkDependencies();
startPm2();
