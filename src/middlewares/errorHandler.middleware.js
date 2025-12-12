import { NODE_ENV } from "../config/env.js";

export function errorHandler(error) {
  console.error("Error:", error);

  const isDevelopment = NODE_ENV === "development";

  return {
    statusCode: error.statusCode || 500,
    body: JSON.stringify({
      message: error.message || "Internal Server Error",
      ...(isDevelopment && { stack: error.stack }),
    }),
  };
}

export function successResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
}
