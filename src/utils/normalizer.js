export function normalizarIngrediente(ingrediente) {
  return ingrediente
    .toLowerCase()
    .replace(/^\d+\s*(kg|g|ml|l|unidade|colher|xícara)?s?\s*/i, "")
    .trim();
}

export function normalizarIngredientes(texto) {
  return texto
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(normalizarIngrediente);
}
