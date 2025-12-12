const securityMiddleware = require("../middlewares/security.middleware.js");
const {
  errorHandler,
  successResponse,
} = require("../middlewares/errorHandler.middleware.js");
const { isValidNotionPayload } = require("../utils/validator.js");
const storageService = require("../services/storage.service.js");
const notionService = require("../services/notion.service.js");
const discordService = require("../services/discord.service.js");

async function handler(event) {
  try {
    // 1. Validação de segurança
    const securityCheck = securityMiddleware(event);
    if (!securityCheck.valid) {
      return {
        statusCode: securityCheck.statusCode,
        body: JSON.stringify({ message: securityCheck.message }),
      };
    }

    // 2. Parse do payload
    let payload;
    try {
      payload = JSON.parse(event.body || "{}");
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON payload" }),
      };
    }

    // 3. Validação do payload Notion
    if (!isValidNotionPayload(payload)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid Notion payload structure" }),
      };
    }

    // 4. Parse da receita
    const receita = notionService.parseReceita(payload);

    // 5. Carregar lista atual
    const lista = await storageService.carregarLista();

    // 6. Adicionar receita à lista
    lista.adicionarReceita(receita);

    // 7. Salvar lista atualizada
    await storageService.salvarLista(lista);

    // 8. Enviar para Discord
    await discordService.enviarReceita(receita, lista);

    // 9. Responder
    return successResponse({
      message: "Receita processada e lista atualizada",
      receita: {
        nome: receita.nome,
        totalIngredientes: receita.ingredientes.length,
      },
      totalItens: Object.keys(lista.itens).length,
    });
  } catch (err) {
    return errorHandler(err);
  }
}

module.exports = { handler };
