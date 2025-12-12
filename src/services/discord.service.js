import axios from "axios";
import { WEBHOOK_URL, DISCORD_TIMEOUT } from "../config/env.js";

class DiscordService {
  async enviarReceita(receita, lista) {
    if (!WEBHOOK_URL) {
      throw new Error("Discord Webhook URL não configurada");
    }

    const embedReceita = this._criarEmbedReceita(receita);
    const embedLista = this._criarEmbedLista(lista);

    try {
      await axios.post(
        WEBHOOK_URL,
        { embeds: [embedReceita, embedLista] },
        {
          headers: { "Content-Type": "application/json" },
          timeout: DISCORD_TIMEOUT,
        }
      );
    } catch (err) {
      console.error("Erro ao enviar para Discord:", err.message);
      throw new Error("Falha ao enviar mensagem para Discord");
    }
  }

  async enviarMensagem(conteudo) {
    if (!WEBHOOK_URL) return;

    try {
      await axios.post(
        WEBHOOK_URL,
        { content: conteudo },
        {
          headers: { "Content-Type": "application/json" },
          timeout: DISCORD_TIMEOUT,
        }
      );
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err.message);
    }
  }

  _criarEmbedReceita(receita) {
    return {
      title: `🍳 Nova Receita: ${receita.nome}`,
      color: 5763719,
      fields: [
        {
          name: "⏱️ Tempo de Preparo",
          value: `${receita.tempoPreparo || "N/A"} minutos`,
          inline: true,
        },
        {
          name: "🍽️ Porções",
          value: `${receita.porcoes || "N/A"}`,
          inline: true,
        },
        {
          name: "📝 Ingredientes",
          value:
            receita.ingredientes.length > 0
              ? receita.ingredientes
                  .map((i) => `• ${i}`)
                  .join("\n")
                  .slice(0, 1024)
              : "Nenhum ingrediente",
          inline: false,
        },
      ],
      timestamp: new Date().toISOString(),
    };
  }

  _criarEmbedLista(lista) {
    const itensOrdenados = lista.getItensOrdenados();
    const listaTexto = itensOrdenados
      .map(([item, data]) => `• ${item} **(${data.count}x)**`)
      .join("\n")
      .slice(0, 4096);

    return {
      title: "🛒 Lista de Compras Atualizada",
      description: listaTexto || "Lista vazia",
      color: 3447003,
      footer: {
        text: `Total: ${Object.keys(lista.itens).length} itens | ${lista.receitas.length} receitas`,
      },
    };
  }
}

export default new DiscordService();
