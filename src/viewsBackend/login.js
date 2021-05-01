//const { ipcMain } = require("electron")
import { ipcMain } from "electron";

ipcMain.on("login-check", (event, arg) => {
  console.log(arg);

  event.reply("login-check", "pong");
});
