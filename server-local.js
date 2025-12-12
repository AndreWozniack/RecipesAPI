const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rota de health check
app.get("/", async (req, res) => {
  try {
    const { handler } = require("./src/handlers/health.handler.js");
    const response = await handler({
      httpMethod: "GET",
      path: "/",
      headers: {},
      body: null,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: err.message });
  }
});

// Rota de webhook
app.post("/webhook", async (req, res) => {
  try {
    const { handler } = require("./src/handlers/webhook.handler.js");
    const response = await handler({
      httpMethod: "POST",
      path: "/webhook",
      headers: req.headers,
      body: JSON.stringify(req.body),
      isBase64Encoded: false,
    });
    res.status(response.statusCode).json(JSON.parse(response.body));
  } catch (err) {
    console.error("Erro:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📝 Webhook: http://localhost:${PORT}/webhook\n`);
});
