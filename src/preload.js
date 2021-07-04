/* eslint-disable prettier/prettier */
//const { contextBridge, ipcRenderer } = require("electron");
import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

// whitelist channels
let validChannels = [
  //Login
  "login-check",
  "login-settings",
  "login-iniciar",
  "login-recuperar",
  //Computers
  "computers-index",
  "computers-connection",
  "computers-connection-close",
  //Connections
  "connections-connection",
  "connections-connection-close",
  "connections-index",
  "connections-creation",
  "connections-edit",
  "connections-verify",
  "connections-statusChange",
  //Synchronizations
  "synchronizations-index",
  "synchronizations-connection",
  "synchronizations-connection-close",
  "synchronizations-run",
  //SynchronizationsForm
  "synchronizationsForm-index",
  "synchronizationsForm-connection",
  "synchronizationsForm-create",
  "synchronizationsForm-save",
  "synchronizationsForm-delete",
  "synchronizationsForm-connection-close",
  //Tasks
  "tasks-index",
  "tasks-connection",
  "tasks-connection-close",
  "tasks-run",
  //TasksForm
  "tasksForm-index",
  "tasksForm-connection",
  "tasksForm-connection-close",
  "tasksForm-create",
  "tasksForm-save",
  //UserSettings
  "user-index",
  "user-connection",
  "user-connection-close",
  "user-save",
  //SystemSettings
  "system-index",
  "system-connection",
  "system-connection-close",
  "system-save",
];

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
  // eslint-disable-next-line no-unused-vars
  removeAllListeners: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
});
