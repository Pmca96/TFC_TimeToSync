//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import * as crypt from "./../libraries/crypto";
import Mongo from "./../libraries/mongodb";
import { machineIdSync } from "node-machine-id";
import os from "os";

import { sessionStorage } from "electron-browser-storage";

var mongoConnection;
ipcMain.on("login-check", async (event) => {
  let uri = crypt.readConfig();
  if (uri != "") {
    mongoConnection = new Mongo(uri);
    let x = await mongoConnection.init();
    if (typeof x.error !== "undefined" && x.error == true)
      event.reply("login-check", {
        page: "setup",
        message:
          "MongoDB address not responding or no connection to the internet.",
      });
    else {
      let data = await mongoConnection.find("Computers", {
        idMaquina: machineIdSync(),
      });
      if (data.length == 0)
        await mongoConnection.insert("Computers", {
          idMaquina: machineIdSync(),
          hostname: os.hostname(),
          isSoftware: 1,
          lastSoftwareActive: new Date(),
        });
      else
        await mongoConnection.update(
          "Computers",
          {
            isSoftware: 1,
            lastSoftwareActive: new Date(),
          },
          { idMaquina: machineIdSync() }
        );
        setSessionAttributes(uri);

      event.reply("login-check", { page: "login" });
    }
  } else event.reply("login-check", { page: "setup" });
});

ipcMain.on("login-settings", async (event, arg) => {
  mongoConnection = new Mongo(arg.mongo);
  let dataReturn = { error: "" };
  let connectionResult = await mongoConnection.init();
  if (arg.password != arg.password1)
    dataReturn = { error: "password1", message: "Passwords does not  match." };

  if (arg.password.length < 8)
    dataReturn = {
      error: "password",
      message: "Password must have at least 8 characters",
    };

  if (!validateEmail(arg.email))
    dataReturn = { error: "email", message: "Email incorrect" };

  if (
    typeof connectionResult.error !== "undefined" &&
    connectionResult.error == true
  )
    dataReturn = {
      error: "mongo",
      message: "Database address is incorrect.",
    };

  if (dataReturn.error == "") {
    let passwordEnc = crypt.encrypt(arg.password);
    let data = await mongoConnection.find(
      "Settings",
      { email: arg.email },
      null,
      0,
      { _id: 0, password: 1, iv: 1 }
    );


    if (data.length == 0) {
      data = await mongoConnection.find("Settings");
      let admin = 0;
      if (data.length == 0) admin = 1;
      await mongoConnection.insert("Settings", {
        email: arg.email,
        password: passwordEnc.content,
        iv: passwordEnc.iv,
        isAdmin: admin,
      });
      data = await mongoConnection.find("Computers", {
        idMaquina: machineIdSync(),
      });
      if (data.length == 0)
        await mongoConnection.insert("Computers", {
          idMaquina: machineIdSync(),
          hostname: os.hostname(),
          isSoftware: 1,
          lastSoftwareActive: new Date(),
        });
      else
        await mongoConnection.update(
          "Computers",
          {
            isSoftware: 1,
            lastSoftwareActive: new Date(),
          },
          { idMaquina: machineIdSync() }
        );
    } else if (
      data[0].iv != passwordEnc.iv ||
      data[0].password != passwordEnc.content
    )
      dataReturn = {
        error: "mongo",
        message: "Password is not correct according to the existing user.",
      };
    await mongoConnection.close();
    if (dataReturn.error == "") {
      crypt.writeConfig(arg.mongo);

      setSessionAttributes(arg.mongo);
    }
  }
  event.reply("login-settings", dataReturn);
});

ipcMain.on("login-iniciar", async (event, arg) => {
  let uri = crypt.readConfig();
  let dataResponse = { error: "" };
  let errorSt = false;
  if (uri == "") {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "Restart aplication.",
    };
  }

  if (!validateEmail(arg.email) && !errorSt) {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "Email is not valid.",
    };
  }

  if (arg.password == "" && !errorSt) {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "Password is empty.",
    };
  }

  if (!errorSt) {
    mongoConnection = new Mongo(uri);
    let x = await mongoConnection.init();
    if (typeof x.error !== "undefined" && x.error == true)
      dataResponse = {
        error: true,
        message: "Check your internet connection.",
      };
    else {
      let passwordEnc = crypt.encrypt(arg.password);
      let data = await mongoConnection.find("Settings", {
        email: arg.email,
        password: passwordEnc.content,
        iv: passwordEnc.iv,
      });

      if (data.length == 0)
        dataResponse = {
          error: true,
          message: "Invalid authentication data.",
        };
      else {
        await mongoConnection.update(
          "Computers",
          {
            isSoftware: 1,
            lastSoftwareActive: new Date(),
          },
          { idMaquina: machineIdSync() }
        );
      }
    }
  }

  event.reply("login-iniciar", dataResponse);
});

async function setSessionAttributes(uri) {
  sessionStorage.setItem("uri", uri);
  let data = await mongoConnection.find("Computers", {
    idMaquina: machineIdSync(),
  });
  sessionStorage.setItem("computer", JSON.stringify(data[0]));
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
