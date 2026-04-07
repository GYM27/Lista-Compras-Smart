import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Tap a product:
 * - Increment quantidade_pendente by 1
 * - Increment contador_frequencia by 1 ONLY on the FIRST tap (0→1)
 *   (the "Gold Rule": frequency tracks how many times a product ran out,
 *    not how many units were bought)
 */
export const tocar = mutation({
  args: { id: v.id("produtos") },
  handler: async (ctx, { id }) => {
    const produto = await ctx.db.get(id);
    if (!produto) throw new Error("Produto não encontrado");

    const isFirstTap = produto.quantidade_pendente === 0;

    await ctx.db.patch(id, {
      quantidade_pendente: produto.quantidade_pendente + 1,
      contador_frequencia: isFirstTap
        ? produto.contador_frequencia + 1
        : produto.contador_frequencia,
    });
  },
});

/**
 * Set a specific quantity (from long-press picker).
 * Same frequency rule: only increment freq if transitioning from 0.
 */
export const definirQuantidade = mutation({
  args: {
    id: v.id("produtos"),
    quantidade: v.number(),
  },
  handler: async (ctx, { id, quantidade }) => {
    const produto = await ctx.db.get(id);
    if (!produto) throw new Error("Produto não encontrado");

    const wasZero = produto.quantidade_pendente === 0;
    const addFreq = wasZero && quantidade > 0;

    await ctx.db.patch(id, {
      quantidade_pendente: quantidade,
      contador_frequencia: addFreq
        ? produto.contador_frequencia + 1
        : produto.contador_frequencia,
    });
  },
});

/**
 * Check off a product (mark as purchased): reset qty to 0.
 */
export const marcarComprado = mutation({
  args: { id: v.id("produtos") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      quantidade_pendente: 0,
      data_ultima_compra: Date.now(),
    });
  },
});

/**
 * Reset ALL products to qty=0 (Clear All).
 */
export const limparTudo = mutation({
  args: {},
  handler: async (ctx) => {
    const todos = await ctx.db.query("produtos").collect();
    await Promise.all(
      todos.map((p) =>
        ctx.db.patch(p._id, { quantidade_pendente: 0 })
      )
    );
  },
});

/**
 * Add a new product to the pantry.
 */
export const adicionar = mutation({
  args: {
    nome: v.string(),
    categoria: v.string(),
    imagem_url: v.optional(v.string()),
  },
  handler: async (ctx, { nome, categoria, imagem_url }) => {
    return await ctx.db.insert("produtos", {
      nome,
      categoria,
      imagem_url,
      quantidade_pendente: 0,
      contador_frequencia: 0,
    });
  },
});

/**
 * Seed demo products (run once from the Convex dashboard or during dev).
 */
export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    const existentes = await ctx.db.query("produtos").collect();
    if (existentes.length > 0) return; // already seeded

    const demo = [
      { nome: "Leite", categoria: "Laticínios", quantidade_pendente: 2, contador_frequencia: 12 },
      { nome: "Pão de Forma", categoria: "Padaria", quantidade_pendente: 0, contador_frequencia: 20 },
      { nome: "Ovos", categoria: "Frescos", quantidade_pendente: 1, contador_frequencia: 18 },
      { nome: "Manteiga", categoria: "Laticínios", quantidade_pendente: 0, contador_frequencia: 8 },
      { nome: "Queijo Flamengo", categoria: "Laticínios", quantidade_pendente: 0, contador_frequencia: 10 },
      { nome: "Iogurte Natural", categoria: "Laticínios", quantidade_pendente: 3, contador_frequencia: 9 },
      { nome: "Frango", categoria: "Carnes & Peixe", quantidade_pendente: 0, contador_frequencia: 15 },
      { nome: "Massa Esparguete", categoria: "Mercearia", quantidade_pendente: 0, contador_frequencia: 7 },
      { nome: "Arroz", categoria: "Mercearia", quantidade_pendente: 1, contador_frequencia: 11 },
      { nome: "Tomate", categoria: "Frescos", quantidade_pendente: 0, contador_frequencia: 14 },
      { nome: "Cebola", categoria: "Frescos", quantidade_pendente: 0, contador_frequencia: 16 },
      { nome: "Detergente Loiça", categoria: "Limpeza", quantidade_pendente: 1, contador_frequencia: 6 },
      { nome: "Papel Higiénico", categoria: "Higiene", quantidade_pendente: 0, contador_frequencia: 13 },
      { nome: "Água", categoria: "Bebidas", quantidade_pendente: 6, contador_frequencia: 22 },
      { nome: "Azeite", categoria: "Mercearia", quantidade_pendente: 0, contador_frequencia: 9 },
      { nome: "Café", categoria: "Mercearia", quantidade_pendente: 0, contador_frequencia: 25 },
      { nome: "Banana", categoria: "Frescos", quantidade_pendente: 0, contador_frequencia: 12 },
      { nome: "Maçã", categoria: "Frescos", quantidade_pendente: 2, contador_frequencia: 8 },
      { nome: "Sabão Roupa", categoria: "Limpeza", quantidade_pendente: 0, contador_frequencia: 5 },
      { nome: "Salsicha", categoria: "Carnes & Peixe", quantidade_pendente: 0, contador_frequencia: 4 },
    ];

    await Promise.all(
      demo.map((p) =>
        ctx.db.insert("produtos", { ...p, imagem_url: undefined })
      )
    );
  },
});
