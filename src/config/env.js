module.exports = {
  WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  WEBHOOK_SECRET: process.env.NOTION_WEBHOOK_SECRET,
  S3_BUCKET: process.env.S3_BUCKET_NAME,
  S3_KEY: "lista-compras/lista-atual.json",
  NODE_ENV: process.env.NODE_ENV || "production",
  MAX_PAYLOAD_SIZE: 1048576, // 1MB
  DISCORD_TIMEOUT: 5000,
};
