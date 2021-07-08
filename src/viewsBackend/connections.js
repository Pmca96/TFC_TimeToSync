//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import Mongo from "../libraries/mongodb";
import MySQL from "../libraries/mysql";
import SqlServer from "../libraries/sqlserver";
import * as crypt from "./../libraries/crypto";
import { sessionStorage } from "electron-browser-storage";
import { ObjectId } from "mongodb";
var mongoConnection;

ipcMain.on("connections-connection", async (event) => {
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
  event.reply("connections-connection", response);
});

ipcMain.on("connections-index", async (event) => {
  let dataResult = await mongoConnection.find(
    "Computers",
    { isService: 1 },
    { hostname: 1 }
  );
  let connections = await mongoConnection.find("Connections", {}, { name: 1 });
  let myComputerData = await sessionStorage.getItem("computer");
  event.reply("connections-index", {
    connections: connections,
    computers: dataResult,
    myComputer: JSON.parse(myComputerData),
  });
});

ipcMain.on("connections-connection-close", async () => {
  await mongoConnection.close();
});

ipcMain.on("connections-creation", async (event, data) => {
  let computers = data.computers;
  data.computers = [];
  computers.map(async (i) => {
    data.computers.push(i._id);
  });
  data.pass = crypt.encrypt(data.pass).content;
  data.status = 0;
  data.dateStatus = new Date();
  let dataResult = await mongoConnection.insert("Connections", data);

  if (dataResult.ops.length > 0)
    event.reply("connections-creation", dataResult.ops[0]);
  else event.reply("connections-creation");
});

ipcMain.on("connections-edit", async (event, data) => {
  let computers = data.computers;
  data.computers = [];
  computers.map(async (i) => {
    data.computers.push(i._id);
  });

  let dataResponse = { dataCopy: JSON.parse(JSON.stringify(data)), error: 0 };

  if (data.pass != "") data.pass = crypt.encrypt(data.pass).content;
  else delete data.pass;

  let id = data._id;
  delete data._id;

  let dataResult = await mongoConnection.update("Connections", data, {
    _id: ObjectId(id)
  });
  dataResponse.error = !dataResult.result.ok;
  event.reply("connections-edit", dataResponse);
});

ipcMain.on("connections-verify", async (event, data) => {
  let connection;

  if (data.pass == "") {
    let dataResult = await mongoConnection.find("Connections", {
      _id: ObjectId(data._id),
    });
    if (dataResult.length == 1)
      data.pass = await crypt.decrypt(dataResult[0].pass);
    else {
      return { error: 1, msg: "Please refresh aplication." };
    }
  }
  if (data.typeDB == "MySQL")
    connection = new MySQL(data.host, data.port, data.user, data.pass);
  else if (data.typeDB == "SQL Server")
    connection = new SqlServer(data.host, data.port, data.user, data.pass);
  let dataConnection = await connection.init();

  let response = {};
  response.state = dataConnection.state;
  if (dataConnection.state != "disconnected") connection.close();

  event.reply("connections-verify", response);
});

ipcMain.on("connections-statusChange", async (event, data) => {
  let dataResult = await mongoConnection.find("Connections", {
    _id: ObjectId(data._id),
  });
  let response = { error: 0, msg: "", data: null };
  if (dataResult.length == 1) {
    dataResult = await mongoConnection.update(
      "Connections",
      { status: 0, dateStatus: new Date() },
      {
        _id: ObjectId(data._id),
      }
    );
    response.error = !dataResult.result.ok;
  } else {
    response = { error: 1, msg: "Please refresh aplication.", data: null };
  }
  event.reply("connections-statusChange", response);
});
