import sql from "mssql";
import DE from "./databaseExtension";

export default class SqlServer extends DE.DatabaseExtension {
  constructor(host, port, user, pass) {
    super();
    this.host = host;
    this.port = port;
    this.user = user;
    this.pass = pass;
  }

  async init() {
    this.sqlConfig = {
      server: this.host,
      port: parseInt(this.port),
      user: this.user,
      password: this.pass,
      trustServerCertificate: true,
    };

    try {
      let self = this;
      return new Promise(function (resolve) {
        sql.connect(self.sqlConfig, function (err) {
          if (err)
            resolve({ state: "disconnected" });
          else
            resolve({ state: "authenticated" });
        });
      });
    } catch (err) {
      return { state: "disconnected" };
    }
  }

  async close() {
    await sql.close();
    return;
  }
}
