const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  if (process.env.NODE_ENV === "dev") {
    app.use(
      proxy("/webcore", {
        target: "http://localhost:9999",
        pathRewrite: { "^/webcore/merchantli": "" }
      })
    );
  } else if (process.env.NODE_ENV !== "production") {
    // 自习室测试环境
    app.use(proxy("/webcore", { target: "http://10.1.1.149" }));
  }
};
