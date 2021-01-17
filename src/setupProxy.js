const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  if (process.env.NODE_ENV === "development") {
    // 如果要精确匹配，则把模糊匹配放在最后
    app.use('/webcore/base', createProxyMiddleware({ target: 'http://yuntun-bj.com', changeOrigin: true }));
    app.use('/webcore', createProxyMiddleware({ target: "http://localhost:4000" }) )
  }
};
