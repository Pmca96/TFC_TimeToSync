import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("synchronizationsForm-connection", async (event) => {
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
  event.reply("synchronizationsForm-connection", response);
});

ipcMain.on("synchronizationsForm-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("synchronizationsForm-index", async (event, data) => {
  let dataComputers = await mongoConnection.find(
    "Computers",
    { isService: 1 },
    { hostname: 1 }
  );
  let connections = await mongoConnection.find("Connections", {}, { name: 1 });
  let dataSynchronism = null;
  if (typeof data != "undefined")
    dataSynchronism = await mongoConnection.find("Synchronizations", {
      _id: ObjectId(data),
    });
  event.reply("synchronizationsForm-index", {
    computers: dataComputers,
    synchronism: dataSynchronism,
    connections: connections,
  });
});

ipcMain.on("synchronizationsForm-create", async (event, data) => {
  let dataSynchronism = data;
  dataSynchronism.computerFrom = data.computerFrom._id;
  dataSynchronism.computerFromConnection = data.computerFromConnection._id;
  dataSynchronism.computerTo = data.computerTo._id;
  dataSynchronism.computerToConnection = data.computerToConnection._id;
  if (dataSynchronism.inactive == 1) dataSynchronism.status = -1;
  else dataSynchronism.status = 0;
  dataSynchronism.dateStatus = new Date();
  delete dataSynchronism._id;
  let dataResult = await mongoConnection.insert(
    "Synchronizations",
    dataSynchronism
  );
  if (dataResult.ops.length > 0)
    event.reply("synchronizationsForm-create", dataResult.ops[0]);
  else event.reply("synchronizationsForm-create");
});

ipcMain.on("synchronizationsForm-save", async (event, data) => {
  let dataSynchronism = data;
  dataSynchronism.computerTo = data.computerTo._id;
  dataSynchronism.computerFrom = data.computerFrom._id;
  dataSynchronism.computerFromConnection = data.computerFromConnection._id;
  dataSynchronism.computerToConnection = data.computerToConnection._id;
  if (dataSynchronism.inactive == 1) {
    dataSynchronism.status = -1;
    dataSynchronism.dateStatus = new Date();
  }
  let idCondition = dataSynchronism._id;
  delete dataSynchronism._id;
  let dataResult = await mongoConnection.update(
    "Synchronizations",
    dataSynchronism,
    { _id: ObjectId(idCondition) }
  );
  event.reply("synchronizationsForm-save", dataResult.result.ok);
});
