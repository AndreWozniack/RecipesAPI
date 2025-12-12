class Lista {
  constructor(data = null) {
    if (data) {
      this.itens = data.itens || {};
      this.receitas = data.receitas || [];
      this.ultimaAtualizacao = data.ultimaAtualizacao;
      this.versao = data.versao || 1;
    } else {
      this.itens = {};
      this.receitas = [];
      this.ultimaAtualizacao = new Date().toISOString();
      this.versao = 1;
    }
  }

  adicionarReceita(receita) {
    const agora = new Date().toISOString();

    // Adicionar receita ao histórico
    this.receitas.push({
      id: receita.id,
      nome: receita.nome,
      adicionadaEm: agora,
    });

    // Adicionar/atualizar ingredientes
    receita.ingredientes.forEach((ingrediente) => {
      if (!this.itens[ingrediente]) {
        this.itens[ingrediente] = {
          count: 0,
          primeiraVez: agora,
          receitas: [],
        };
      }

      this.itens[ingrediente].count++;
      this.itens[ingrediente].receitas.push(receita.nome);
      this.itens[ingrediente].ultimaAtualizacao = agora;
    });

    this.ultimaAtualizacao = agora;
    return this;
  }

  removerIngrediente(ingrediente) {
    if (this.itens[ingrediente]) {
      delete this.itens[ingrediente];
      this.ultimaAtualizacao = new Date().toISOString();
      return true;
    }
    return false;
  }

  limpar() {
    this.itens = {};
    this.receitas = [];
    this.ultimaAtualizacao = new Date().toISOString();
    return this;
  }

  getItensOrdenados(limite = 25) {
    return Object.entries(this.itens)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, limite);
  }

  toJSON() {
    return {
      itens: this.itens,
      receitas: this.receitas,
      ultimaAtualizacao: this.ultimaAtualizacao,
      versao: this.versao,
    };
  }
}

module.exports = Lista;
