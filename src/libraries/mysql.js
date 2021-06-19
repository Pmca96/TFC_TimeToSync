import mysql from "mysql";
import DE from "./databaseExtension";

export default class MySQL extends DE.DatabaseExtension {
  constructor(host, port, user, pass) {
    super();
    this.host = host;
    this.port = port;
    this.user = user;
    this.pass = pass;
  }

  async init() {
    this.client = mysql.createConnection({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.pass,
    });
    try {
      let self = this;
      return new Promise(function (resolve) {
        self.client.connect(function () {
          resolve(self.client);
        });
      });
    } catch (err) {
      return { state:"disconnected" };
    }
  }

  async close() {
    await this.client.destroy();
    return;
  }
}
