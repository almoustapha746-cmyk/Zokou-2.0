const fs = require("fs"); 
const { spawnSync, spawn } = require("child_process"); 

const zokouEnv = {
  "name": "zokou-md-deploy",
  "version": "1.0.0",
  "description": "Déploiement automatique du bot Zokou-MD",
  "main": "index.js",
  "scripts": {
    "init-bot": "git clone https://gitlab.com temp_zokou && cp -r temp_zokou/. . && rm -rf temp_zokou",
    "install-bot": "npm install",
    "build": "npm run init-bot && npm run install-bot",
    "start": "node index.js"
  },
  "dependencies": {}
}

  SESSION_ID: "4e6bc1ab82", 
  PREFIX: ".", 
  AUTO_READ_STATUS: "non", 
  AUTO_DOWNLOAD_STATUS: "oui", 
  BOT_NAME: "Zokou-MD", 
  MENU_THEME: "LUFFY", 
  PM_PERMIT: "non", 
  MODE_PUBLIC: "oui", 
  PRESENCE: "1", 
  OWNER_NAME: "deku", 
  OWNER_NUMBER: "22782908895", 
  WARN_COUNT: 3, 
  STARTING_BOT_MESSAGE: "oui", 
  PM_CHATBOT: "oui", 
  ANTI_COMMAND_SPAM: "non", 
  ANTI_DELETE_MESSAGE: "non", 
  AUTO_REACT_MESSAGE: "oui", 
  AUTO_REACT_STATUS: "non", 
  TIME_ZONE: "Africa/Sao_Tome", 
  SERVER: "vps", 
  STICKER_PACKNAME: "made with ❤; Zokou-MD", 
}; 

function cloneRepository() { 
  console.log("Clonage du dépôt en cours...");
  const cloneResult = spawnSync("git", [ "clone", "https://gitlab.com", "zokou", ]); 
  
  if (cloneResult.error) { 
    console.error("Erreur lors du clonage du dépôt :", cloneResult.error); 
    process.exit(1);
  } 

  const envFile = "zokou/set.env"; 
  if (!fs.existsSync(envFile)) { 
    for (const [key, value] of Object.entries(zokouEnv)) { 
      if (value !== undefined && value !== null) {
        fs.appendFileSync(envFile, `${key}=${value}\n`); 
      }
    } 
  } 
  installDependencies(); 
} 

function installDependencies() { 
  console.log("Installation des dépendances npm...");
  const result = spawnSync("npm", ["install"], { cwd: "zokou", stdio: "inherit", env: { ...process.env, CI: "true" }, }); 
  
  if (result.error || result.status !== 0) { 
    console.error("Erreur critique lors de l'installation des dépendances."); 
    process.exit(1); 
  } 
} 

function checkDependencies() { 
  const result = spawnSync("npm", ["ls"], { cwd: "zokou", stdio: "ignore" }); 
  if (result.status !== 0) { 
    console.log("Dépendances manquantes ou invalides. Réinstallation..."); 
    installDependencies(); 
  } else { 
    console.log("Toutes les dépendances sont correctement installées."); 
  } 
} 

function startPm2() { 
  console.log("Démarrage du bot Zokou avec PM2...");
  const pm2 = spawn( "npx", ["pm2", "start", "index.js", "--name", "zokou", "--attach"], { cwd: "zokou", stdio: "inherit", } ); 
  
  pm2.on("exit", (code) => { 
    if (code !== 0) console.error(`PM2 s'est arrêté avec le code d'erreur : ${code}`); 
  }); 
  pm2.on("error", (err) => { 
    console.error("PM2 a rencontré une erreur fatale :", err); 
  }); 
} 

// Gestion des dossiers corrompus au démarrage
if (fs.existsSync("zokou") && !fs.existsSync("zokou/package.json")) {
  console.log("Dossier zokou corrompu détecté. Nettoyage...");
  fs.rmSync("zokou", { recursive: true, force: true });
}

if (!fs.existsSync("zokou")) { 
  cloneRepository(); 
} else {
  checkDependencies(); 
}

startPm2();
