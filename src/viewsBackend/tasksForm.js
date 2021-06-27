import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("tasksForm-connection", async (event) => {
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
  event.reply("tasksForm-connection", response);
});

ipcMain.on("tasksForm-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("tasksForm-index", async (event, data) => {
  let dataSynchronism = null;
  let task = null;
  let databaseFrom = null;
  let databaseTo = null;
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
  if (typeof data != "undefined") {
    dataSynchronism = await mongoConnection.find("Synchronizations", {
      _id: ObjectId(data.id),
    });
    if (dataSynchronism.length == 1) {
      databaseFrom = await mongoConnection.find("Databases", {
        idConnection: dataSynchronism[0].computerFromConnection,
      });

      databaseTo = await mongoConnection.find("Databases", {
        idConnection: dataSynchronism[0].computerToConnection,
      });
    }
  }

  event.reply("tasksForm-index", {
    task: task,
    computers: computers,
    connections: connections,
    synchronism: dataSynchronism,
    databaseFrom: databaseFrom,
    databaseTo: databaseTo,
  });
});
ipcMain.on("tasksForm-create", async (event, data) => {
  let dataSynchronism = await mongoConnection.find(
    "Synchronizations",
    {
      _id: ObjectId(data[0]._id),
    },
    null,
    0,
    { _id: 0, tasks: 1 }
  );

  if (dataSynchronism != "undefined" && dataSynchronism.length == 1) {
    let taskNumber = 1;
    if (
      typeof dataSynchronism[0].tasks != "undefined" &&
      dataSynchronism[0].tasks.length > 0
    )
      dataSynchronism[0].tasks.map((i) => {
        if (i.taskNumber >= taskNumber) taskNumber = i.taskNumber + 1;
      });
    data[1].taskNumber = taskNumber;

    if (data[1].dependencies.length > 0) {
      let dependencies = data[1].dependencies;
      let dependenciesToRegist = [];
      dependencies.map((i) => {
        dependenciesToRegist.push(i._id);
      });
      data[1].dependencies = dependenciesToRegist;
    }

    let databaseToRegist = data[1].databaseTo._id;
    data[1].databaseTo = databaseToRegist;

    let tableToRegist = data[1].tableTo.name;
    data[1].tableTo = tableToRegist;
    data[1].status = 0;
    data[1].dateStatus = new Date();

    let dataResult = await mongoConnection.push(
      "Synchronizations",
      { tasks: data[1] },
      { _id: ObjectId(data[0]._id) }
    );
    event.reply("tasksForm-create", dataResult.result.ok);
  } else event.reply("tasksForm-create", "0");
});
