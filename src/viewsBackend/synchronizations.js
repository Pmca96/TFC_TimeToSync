//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
var mongoConnection;

ipcMain.on("synchronizations-connection", async (event) => {
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
        message:
          "MongoDB address not responding or no connection to the internet.",
      };
  } else
    response = {
      error: true,
      severity: 2,
      message: "Something went wrong, please restart application.",
    };

  event.reply("synchronizations-connection", response);
});

ipcMain.on("synchronizations-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("synchronizations-index", async (event) => {
  let computers = await mongoConnection.find(
    "Computers",
    { isService: 1 },
    { hostname: 1 }
  );
  let connections = await mongoConnection.find(
    "Connections",
    { status: 2 },
    { name: 1 }
  );
  let synchronizations = await mongoConnection.find(
    "Synchronizations",
    {},
    { name: 1 }
  );

  event.reply("synchronizations-index", {
    computers: computers,
    synchronizations: synchronizations,
    connections: connections,
  });
});
