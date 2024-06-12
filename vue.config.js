const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        // target: "http://wuyi.life/api/",
        target: "http://wuyi.life/",
        changeOrigin: true,
        // pathRewrite: {
        //   "^/api": "",
        // },
      },
    },
    client: {
      overlay: false
    },
  },
});
