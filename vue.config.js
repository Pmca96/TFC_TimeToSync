module.exports = {
    configureWebpack: {
        target: "web"
        //target : "electron-renderer"
    },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      preload: 'src/preload.js',
    },
  },
};