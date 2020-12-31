const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  if (process.env.NODE_ENV === "development") {
    app.use("/webcore", createProxyMiddleware({ target: "http://localhost:4000" }));
  }
};
