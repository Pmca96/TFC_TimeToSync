/* eslint-disable prettier/prettier */
import { MongoClient } from "mongodb";
import DE from "./databaseExtension";

export default class Mongo extends DE.DatabaseExtension {
  constructor(uri) {
    super();
    this.uri = uri;
    this.db = "TimeToSync";
  }

  async init() {
    this.client = new MongoClient(this.uri, { useUnifiedTopology: true });
    try {
      await this.client.connect();
      this.database = await this.client.db(this.db);
      return this.database;
    } catch (err) {
      return { error: true, err };
    }
  }

  async insert(collection, doc, isMany = 0) {
    let collectionSetted = this.database.collection(collection);
    let result;
    if (isMany) result = await collectionSetted.insertMany(doc);
    else result = await collectionSetted.insertOne(doc);
    return result;
  }

  async find(collection, query = null, sort = null, limit = 0, projection = null) {
    let collectionSetted = this.database.collection(collection);
    let result;

    result = await collectionSetted.find(query).sort(sort).limit(limit).project(projection);
    let data = result.toArray();
    return data;
  }

  async count(collection, query = null ) {
    let collectionSetted = this.database.collection(collection);
    let result;

    result = await collectionSetted.find(query).count();
    let data = result;
    return data;
  }

  async update(collection, setChanges, query = {}, isMany = false) {
    let collectionSetted = this.database.collection(collection);
    let result;
    if (isMany)
      result = await collectionSetted.updateMany(query, { $set: setChanges });
    else result = await collectionSetted.updateOne(query, { $set: setChanges });
    return result;
  }

  async push(collection, setChanges, query = {}, isMany = false) {
    let collectionSetted = this.database.collection(collection);
    let result;
    if (isMany)
      result = await collectionSetted.updateMany(query, { $push: setChanges });
    else result = await collectionSetted.updateOne(query, { $push: setChanges });
    return result;
  }
  async aggregate(collection, query) {
    let result = await this.database.collection(collection).aggregate(query);

    return await result.toArray();
  }

  async delete(collection, where = {}, isMany = false) {
    let collectionSetted = this.database.collection(collection);
    let result;

    if (isMany) result = await collectionSetted.deleteMany(where);
    else result = await collectionSetted.deleteOne(where);
    return result;
  }

  async close() {
    await this.client.close();
    return;
  }
}
