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
        message: "Mongo indisponivel ou sem ligação à internet.",
      };
  } else
    response = {
      error: true,
      severity: 2,
      message: "Occoreu um problema, reinicie a aplicação",
    };
  event.reply("computers-connection", response);
});

ipcMain.on("computers-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("computers-filter", async (event, data) => {
  let find = {};
  if (data.text != "") find = { hostname: new RegExp(data.text, "i")};
  let dataResult = await mongoConnection.find("Maquinas", find);
  
  let dataResultArr = await dataResult.toArray();
  event.reply("computers-filter", dataResultArr);
});
