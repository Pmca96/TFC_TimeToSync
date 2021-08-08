module.exports = {
  configureWebpack: {
    target: "web",
    //target : "electron-renderer"
  },
  pluginOptions: {
    electronBuilder: {
      productName: "TimeToSync",
      nodeIntegration: true,
      preload: "src/preload.js",
      win: {
        icon: 'public/logo.ico',
      }
    },
  },
};
