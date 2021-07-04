//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
import { sessionStorage } from "electron-browser-storage";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("system-connection", async (event) => {
  let uri = await sessionStorage.getItem("uri");
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
        message:
          "MongoDB host not responding or no connection to the internet.",
      };
  } else
    response = {
      error: true,
      severity: 2,
      message: "Something went wrong, please restart application.",
    };
  event.reply("system-connection", response);
});

ipcMain.on("system-index", async (event) => {
  let dataResult = await mongoConnection.find("Configuration");
  event.reply("system-index", dataResult);
});

ipcMain.on("system-save", async (event, data) => {
  if (data.smtpPass != "")
    data.smtpPass = (await crypt.encrypt(data.smtpPass)).content;
  else delete data.smtpPass;
  let dataResult = null;
  if (typeof data._id == "undefined") {
    dataResult = await mongoConnection.insert("Configuration", data);
    event.reply("system-save",dataResult.ops[0]);
  } else {
    let idConf = data._id
    delete data._id
    dataResult = await mongoConnection.update("Configuration", data, {_id: ObjectId(idConf)});
    event.reply("system-save", dataResult.result.ok);
  }
});

ipcMain.on("system-connection-close", async () => {
  await mongoConnection.close();
});
