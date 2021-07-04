//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
import { sessionStorage } from "electron-browser-storage";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("user-connection", async (event) => {
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
  event.reply("user-connection", response);
});

ipcMain.on("user-index", async (event) => {
  let dataResult = await mongoConnection.find("Settings", {
    email: await sessionStorage.getItem("email"),
  });
  event.reply("user-index", dataResult);
});

ipcMain.on("user-save", async (event, data) => {
  let UserId = data._id;
  delete data._id;
  delete data.passConfirm
  if (data.password != "") 
    data.password = (await crypt.encrypt(data.password)).content;
  else
    delete data.password;
  let dataResult = await mongoConnection.update(
    "Settings",
    data ,
    { _id: ObjectId(UserId) }
  );
  event.reply("user-save", dataResult.result.ok);
});

ipcMain.on("user-connection-close", async () => {
  await mongoConnection.close();
});
