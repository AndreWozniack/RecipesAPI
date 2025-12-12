const { WEBHOOK_SECRET, MAX_PAYLOAD_SIZE } = require("../config/env.js");
const { verifySignature } = require("../utils/validator.js");

function securityMiddleware(event) {
  // Verificar método HTTP
  if (event.httpMethod !== "POST") {
    return {
      valid: false,
      statusCode: 405,
      message: "Method Not Allowed",
    };
  }

  // Verificar Content-Type
  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"];
  if (!contentType || !contentType.includes("application/json")) {
    return {
      valid: false,
      statusCode: 415,
      message: "Unsupported Media Type",
    };
  }

  // Verificar tamanho do payload
  if (event.body && event.body.length > MAX_PAYLOAD_SIZE) {
    return {
      valid: false,
      statusCode: 413,
      message: "Payload Too Large",
    };
  }

  // Verificar signature (se configurado)
  if (WEBHOOK_SECRET) {
    const signature = event.headers["x-notion-signature"];
    if (!signature || !verifySignature(event.body, signature, WEBHOOK_SECRET)) {
      return {
        valid: false,
        statusCode: 403,
        message: "Invalid Signature",
      };
    }
  }

  return { valid: true };
}

module.exports = securityMiddleware;
