//const { ipcMain } = require("electron")
import { ipcMain } from "electron";
import * as crypt from "./../libraries/crypto";
import Mongo from "./../libraries/mongodb";
import { machineIdSync } from "node-machine-id";
import os from "os";
var mongoConnection;
ipcMain.on("login-check", async (event) => {
  let uri = crypt.readConfig();
  if (uri != "") {
    mongoConnection = new Mongo(uri);
    let x = await mongoConnection.init();
    if (typeof x.error !== "undefined" && x.error == true)
      event.reply("login-check", {
        page: "setup",
        message: "Endereço de mongo incorreto ou sem ligação à internet.",
      });
    else event.reply("login-check", { page: "login" });
  } else event.reply("login-check", { page: "setup" });
});

ipcMain.on("login-configurar", async (event, arg) => {
  mongoConnection = new Mongo(arg.mongo);
  let dataReturn = { error: "" };
  let connectionResult = await mongoConnection.init();
  if (arg.password != arg.password1)
    dataReturn = { error: "password1", message: "Password não é igual" };

  if (arg.password.length < 8)
    dataReturn = {
      error: "password",
      message: "Password tem de ter no minimo 8 caracteres",
    };

  if (!validateEmail(arg.email))
    dataReturn = { error: "email", message: "Email incorreto" };

  if (
    typeof connectionResult.error !== "undefined" &&
    connectionResult.error == true
  )
    dataReturn = {
      error: "mongo",
      message: "O endereço da base de dados encontra-se incorreto",
    };

  if (dataReturn.error == "") {
    let passwordEnc = crypt.encrypt(arg.password);
    let data = await mongoConnection.find(
      "Configuracao",
      { email: arg.email },
      null,
      0,
      { _id: 0, password: 1, iv: 1 }
    );

    let dataResult = await data.toArray();

    if (dataResult.length == 0) {
      data = await mongoConnection.find("Configuracao");
      dataResult = await data.toArray();
      let admin = 0;
      if (dataResult.length == 0) admin = 1;
      await mongoConnection.insert("Configuracao", {
        email: arg.email,
        password: passwordEnc.content,
        iv: passwordEnc.iv,
        isAdmin: admin,
      });
      data = await mongoConnection.find("Maquinas", {
        idMaquina: machineIdSync(),
      });
      dataResult = await data.toArray();
      if (dataResult.length == 0)
        await mongoConnection.insert("Maquinas", {
          idMaquina: machineIdSync(),
          hostname: os.hostname(),
          isService: 1,
        });
      else
        await mongoConnection.update(
          "Maquinas",
          {
            isService: 1,
          },
          { idMaquina: machineIdSync() }
        );
    } else if (
      dataResult[0].iv != passwordEnc.iv ||
      dataResult[0].password != passwordEnc.content
    )
      dataReturn = {
        error: "mongo",
        message: "A password é diferente da que se encontra na base de dados",
      };
    await mongoConnection.close();
    if (dataReturn.error == "") crypt.writeConfig(arg.mongo);
  }
  event.reply("login-configurar", dataReturn);
});

ipcMain.on("login-iniciar", async (event, arg) => {
  let uri = crypt.readConfig();
  let dataResponse = { error: "" };
  let errorSt = false;
  if (uri == "") {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "Reinicie a aplicação",
    };
  }

  if (!validateEmail(arg.email) && !errorSt) {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "O email não é válido",
    };
  }

  if (arg.password == "" && !errorSt) {
    errorSt = true;
    dataResponse = {
      error: errorSt,
      message: "A password está vazia",
    };
  }

  if (!errorSt) {
    mongoConnection = new Mongo(uri);
    let x = await mongoConnection.init();
    if (typeof x.error !== "undefined" && x.error == true)
      dataResponse = {
        error: true,
        message: "Verifique a sua ligação à internet.",
      };
    else {
      let passwordEnc = crypt.encrypt(arg.password);
      let data = await mongoConnection.find("Configuracao", {
        email: arg.email,
        password: passwordEnc.content,
        iv: passwordEnc.iv,
      });

      let dataResult = await data.toArray();

      if (dataResult.length == 0)
        dataResponse = {
          error: true,
          message: "Dados incorretos",
        };
    }
  }

  event.reply("login-iniciar", dataResponse);
});

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
