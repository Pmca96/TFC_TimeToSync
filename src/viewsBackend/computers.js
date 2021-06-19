//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
var mongoConnection;

ipcMain.on("computers-connection", async (event) => {
  let uri = crypt.readConfig();
  let response = {
    error: false,
    severity: 0,
    message: "",
  };
  if (uri != "") {
    mongoConnection = new Mongo(uri);
    let x = await mongoConnection.init();
    if (typeof x.error !== "undefined" && x.error == true)
      response = {
        error: true,
        severity: 1,
        message: "MongoDB address not responding or no connection to the internet.",
      };
  } else
    response = {
      error: true,
      severity: 2,
      message: "Something went wrong, please restart application.",
    };
  event.reply("computers-connection", response);
});

ipcMain.on("computers-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("computers-index", async (event) => {
  let find = {};

  let dataResult = await mongoConnection.find("Computers", find, { hostname: 1 });

  event.reply("computers-index", dataResult);
});
