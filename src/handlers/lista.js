const {
  errorHandler,
  successResponse,
} = require("../middlewares/errorHandler.middleware.js");
const storageService = require("../services/storage.service.js");
const discordService = require("../services/discord.service.js");
const { normalizarIngrediente } = require("../utils/normalizer.js");

async function obterLista(event) {
  try {
    const lista = await storageService.carregarLista();

    return successResponse({
      totalItens: Object.keys(lista.itens).length,
      totalReceitas: lista.receitas.length,
      ultimaAtualizacao: lista.ultimaAtualizacao,
      itens: Object.entries(lista.itens).map(([ingrediente, data]) => ({
        ingrediente,
        quantidadeReceitas: data.count,
        receitas: data.receitas,
        adicionadoEm: data.primeiraVez,
      })),
      receitas: lista.receitas,
    });
  } catch (err) {
    return errorHandler(err);
  }
}

async function limparListaHandler(event) {
  try {
    await storageService.limparLista();
    await discordService.enviarMensagem("🗑️ Lista de compras foi limpa!");

    return successResponse({
      message: "Lista de compras limpa com sucesso",
    });
  } catch (err) {
    return errorHandler(err);
  }
}

async function removerIngrediente(event) {
  try {
    const { ingrediente } = JSON.parse(event.body || "{}");

    if (!ingrediente) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Ingrediente não especificado" }),
      };
    }

    const lista = await storageService.carregarLista();
    const ingredienteNormalizado = normalizarIngrediente(ingrediente);

    if (lista.removerIngrediente(ingredienteNormalizado)) {
      await storageService.salvarLista(lista);

      return successResponse({
        message: `Ingrediente "${ingredienteNormalizado}" removido com sucesso`,
      });
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Ingrediente "${ingredienteNormalizado}" não encontrado`,
        }),
      };
    }
  } catch (err) {
    return errorHandler(err);
  }
}

module.exports = { obterLista, limparListaHandler, removerIngrediente };
