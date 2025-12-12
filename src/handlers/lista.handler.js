import {
  errorHandler,
  successResponse,
} from "../middlewares/errorHandler.middleware.js";
import storageService from "../services/storage.service.js";
import discordService from "../services/discord.service.js";
import { normalizarIngrediente } from "../utils/normalizer.js";

const { carregarLista, limparLista, salvarLista } = {
  carregarLista: () => storageService.carregarLista(),
  limparLista: () => storageService.limparLista(),
  salvarLista: (lista) => storageService.salvarLista(lista),
};

export async function obterLista(event) {
  try {
    const lista = await carregarLista();

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

export async function limparListaHandler(event) {
  try {
    await limparLista();
    await discordService.enviarMensagem("🗑️ Lista de compras foi limpa!");

    return successResponse({
      message: "Lista de compras limpa com sucesso",
    });
  } catch (err) {
    return errorHandler(err);
  }
}

export async function removerIngrediente(event) {
  try {
    const { ingrediente } = JSON.parse(event.body || "{}");

    if (!ingrediente) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Ingrediente não especificado" }),
      };
    }

    const lista = await carregarLista();
    const ingredienteNormalizado = normalizarIngrediente(ingrediente);

    if (lista.removerIngrediente(ingredienteNormalizado)) {
      await salvarLista(lista);

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
