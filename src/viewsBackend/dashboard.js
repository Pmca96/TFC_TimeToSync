//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import * as crypt from "./../libraries/crypto";
var mongoConnection;

ipcMain.on("dashboard-connection", async (event) => {
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
  event.reply("dashboard-connection", response);
});

ipcMain.on("dashboard-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("dashboard-index", async (event) => {
  let tasksActive = await mongoConnection.count("Synchronizations", {
    "tasks.status": { $ne: -2 },
    inactive: false,
  });
  let tasksFailed = await mongoConnection.count("Synchronizations", {
    "tasks.status": -2,
    inactive: false,
  });
  let syncsActive = await mongoConnection.count("Synchronizations", {
    status: { $ne: -2 },
    inactive: false,
  });
  let SyncsFailed = await mongoConnection.count("Synchronizations", {
    status: -2,
    inactive: false,
  });

  let connectionsActive = await mongoConnection.count("Connections", {
    status: { $ne: -1 },
  });
  let connectionsFailed = await mongoConnection.count("Connections", {
    status: -1,
  });

  var date = new Date(); // Todays date - the Date() constructor will default to the current date/time if no value is passed to it

  let servicesActive = await mongoConnection.count("Computers", {
    lastServiceActive: {
      $gte: new Date(date.getTime() - 10 * 60 * 1000),
    },
    isService: 1,
  });
  let servicesFailed = await mongoConnection.count("Computers", {
    lastServiceActive: {
      $lt: new Date(date.getTime() - 10 * 60 * 1000),
    },
    isService: 1,
  });

  let tasksTotals = await mongoConnection.aggregate("TasksHistory", [
    {
      $match: {
        dateStatus: {
          $gte: new Date(date.getTime() - (30 * 24 * 60 * 60 * 1000)),
        },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateStatus" } },
        totalUpdated: { $sum: "$updated" },
        totalInserted: { $sum: "$inserted" },
      },
    },
  ]);

  let tasksTotalsFinal = [[], [], []];
  let startDate = new Date(date.getTime() - (30 * 24 * 60 * 60 * 1000));
  let endDate = new Date();

  while (startDate.getTime() <= endDate.getTime()) {
    let found = 0
    tasksTotals.map(i => {
      if (found == 0 && i._id == (startDate.getFullYear()+"-"+pad(startDate.getMonth()+1,2)+"-"+pad(startDate.getDate(),2))) {
        found =1;
        tasksTotalsFinal[0].push(pad(startDate.getDate(),2)+"/"+pad(startDate.getMonth()+1,2))
        tasksTotalsFinal[1].push(i.totalUpdated)
        tasksTotalsFinal[2].push(i.totalInserted)
      }
    })
    if (found == 0) {
      tasksTotalsFinal[0].push(pad(startDate.getDate(),2)+"/"+pad(startDate.getMonth()+1,2))
      tasksTotalsFinal[1].push(0)
      tasksTotalsFinal[2].push(0)
    }

    startDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000) )
  }
  
  event.reply("dashboard-index", [
    servicesActive,
    servicesFailed,
    connectionsActive,
    connectionsFailed,
    syncsActive,
    SyncsFailed,
    tasksActive,
    tasksFailed,
    tasksTotalsFinal,
  ]);
});

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
