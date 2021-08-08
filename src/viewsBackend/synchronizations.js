//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import { ObjectId } from "mongodb";
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
    { },
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

ipcMain.on("synchronizations-run", async (event, data) => {
  let dataResult = { result: { ok: 0 } };
  let dataTasks = await mongoConnection.find("Synchronizations", {
    _id: ObjectId(data.idSync),
  });

  if (dataTasks.length > 0 && dataTasks[0].tasks.length > 0) {
    await Promise.all(
      dataTasks[0].tasks.map(async (i) => {
        if (i.status != 3 && i.inactive != 1) {
          let dataToInsert = JSON.parse(JSON.stringify(data));
          dataToInsert.idTask = i._id;
          dataResult = await mongoConnection.insert(
            "TasksHistory",
            dataToInsert
          );

          if (dataResult.ops.length > 0) {
            await mongoConnection.update(
              "Synchronizations",
              {
                "tasks.$.status": 3,
                "tasks.$.dateStatus": new Date(),
              },
              { _id: ObjectId(data.idSync), "tasks._id": dataToInsert.idTask }
            );
          }
        }
        await mongoConnection.update(
          "Synchronizations",
          {
            status: 3,
            dateStatus: new Date(),
          },
          { _id: ObjectId(data.idSync) }
        );
      })
    );
  }
  event.reply("synchronizations-run", {
    result: dataResult.result.ok,
    idSync: data.idSync,
  });
});
