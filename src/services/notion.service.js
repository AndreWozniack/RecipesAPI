const { normalizarIngredientes } = require("../utils/normalizer.js");

class NotionService {
  parseReceita(notionPayload) {
    const page = notionPayload.data;
    const props = page.properties;

    const nome = props["Nome da Receita"]?.title?.[0]?.plain_text || "Sem nome";

    const ingredientesText =
      props["Ingredientes"]?.rich_text?.[0]?.plain_text || "";

    const ingredientes = normalizarIngredientes(ingredientesText);

    const tempoPreparo = props["Tempo de Preparo"]?.number || null;
    const porcoes = props["Porções"]?.number || null;

    return {
      id: page.id,
      nome,
      ingredientes,
      tempoPreparo,
      porcoes,
      criadoEm: page.created_time,
    };
  }
}

module.exports = new NotionService();
