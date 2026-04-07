import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  produtos: defineTable({
    nome: v.string(),
    categoria: v.string(),
    imagem_url: v.optional(v.string()),
    quantidade_pendente: v.number(),
    contador_frequencia: v.number(),
    data_ultima_compra: v.optional(v.number()), // Unix timestamp ms
  })
    .index("by_nome", ["nome"])
    .index("by_categoria", ["categoria"])
    .index("by_frequencia", ["contador_frequencia"]),
});
