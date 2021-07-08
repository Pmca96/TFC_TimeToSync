//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import { sessionStorage } from "electron-browser-storage";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("tasks-connection", async (event) => {
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
  event.reply("tasks-connection", response);
});

ipcMain.on("tasks-index", async (event, data) => {
  let synchronism = await mongoConnection.find("Synchronizations", {
    _id: ObjectId(data),
  });
  let connectionsTo = {};
  if (synchronism.length > 0)
    connectionsTo = await mongoConnection.find("Databases", {
      idConnection: synchronism[0].computerToConnection,
    });

  event.reply("tasks-index", {
    synchronism: synchronism,
    connectionsTo: connectionsTo,
  });
});
ipcMain.on("tasks-run", async (event, data) => {
  data.statusDate = new Date();
  data.history = [{ status: 0, dateStatus: new Date() }];
  let dataResult = await mongoConnection.insert("TasksHistory", data);
  if (dataResult.ops.length > 0) {
    await mongoConnection.update(
      "Synchronizations",
      {
        "tasks.$.status": 3,
        "tasks.$.dateStatus": new Date(),
      },
      { _id: ObjectId(data.idSync), "tasks._id": data.idTask }
    );
  }
  event.reply("tasks-run", {
    result: dataResult.result.ok,
    idTask: data.idTask,
  });
});

ipcMain.on("tasks-connection-close", async () => {
  await mongoConnection.close();
});
