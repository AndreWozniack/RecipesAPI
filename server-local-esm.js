import express from "express";
import dotenv from "dotenv";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Importar handlers
import("./src/handlers/webhook.handler.js").then(
  ({ handler: webhookHandler }) => {
    import("./src/handlers/health.handler.js").then(
      ({ handler: healthHandler }) => {
        // Middleware
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Middleware para logs
        app.use((req, res, next) => {
          console.log(
            `[${new Date().toISOString()}] ${req.method} ${req.path}`
          );
          next();
        });

        // Rota de health check
        app.get("/", async (req, res) => {
          try {
            const lambdaEvent = {
              httpMethod: "GET",
              path: "/",
              headers: {},
              body: null,
            };

            const response = await healthHandler(lambdaEvent);
            res.status(response.statusCode).json(JSON.parse(response.body));
          } catch (err) {
            console.error("Erro na rota health check:", err);
            res.status(500).json({ error: err.message });
          }
        });

        // Rota de webhook
        app.post("/webhook", async (req, res) => {
          try {
            // Construir um evento similar ao que a AWS Lambda enviaria
            const lambdaEvent = {
              httpMethod: "POST",
              path: "/webhook",
              headers: req.headers,
              body: JSON.stringify(req.body),
              isBase64Encoded: false,
            };

            const response = await webhookHandler(lambdaEvent);
            res.status(response.statusCode).json(JSON.parse(response.body));
          } catch (err) {
            console.error("Erro na rota webhook:", err);
            res.status(500).json({
              error: err.message,
              stack:
                process.env.NODE_ENV === "development" ? err.stack : undefined,
            });
          }
        });

        // Iniciar servidor
        app.listen(PORT, () => {
          console.log(
            `\n🚀 Servidor local rodando em http://localhost:${PORT}`
          );
          console.log(
            `📝 Webhook disponível em: http://localhost:${PORT}/webhook`
          );
          console.log(`💚 Health check em: http://localhost:${PORT}/\n`);
          console.log("Pressione Ctrl+C para parar.\n");
        });

        // Graceful shutdown
        process.on("SIGTERM", () => {
          console.log("\nServidor encerrado.");
          process.exit(0);
        });
      }
    );
  }
);
