import { successResponse } from "../middlewares/errorHandler.middleware.js";

export async function handler(event) {
  return successResponse({
    message: "Lambda funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
