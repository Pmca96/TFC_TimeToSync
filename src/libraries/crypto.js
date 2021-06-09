import crypto from "crypto";
import fs from "fs";
import path from "path";

const algorithm = "aes-256-ctr";
const secretKey = "vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3";
//const iv =crypto.randomBytes(16);
const iv = Buffer.alloc(16);

export const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

   const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(iv.toString("hex"), "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

export const readConfig = () => {
  try {
    return decrypt(
      fs.readFileSync(path.resolve(__dirname + "./../config.cnf"), "utf8")
    );
  } catch (error) {
    return "";
  }
};

export const writeConfig = (text) => {
  text = encrypt(text);
  let data = fs.writeFileSync(__dirname + "./../config.cnf", text.content);

  return data;
};
