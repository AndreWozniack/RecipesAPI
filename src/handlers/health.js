const {
  successResponse,
} = require("../middlewares/errorHandler.middleware.js");

async function handler(event) {
  return successResponse({
    message: "Lambda funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}

module.exports = { handler };
