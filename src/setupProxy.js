const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const BACKEND_DOMAIN_UAT = "https://4pqb465jei.us-east-1.awsapprunner.com";
  const BACKEND_DOMAIN_LOCALHOST = "http://localhost:8080";

  app.use(
    "/backend-assets",
    createProxyMiddleware({
      target:
        process.env.NODE_ENV === "production"
          ? BACKEND_DOMAIN_UAT
          : BACKEND_DOMAIN_LOCALHOST,
      changeOrigin: true,
    })
  );
};
