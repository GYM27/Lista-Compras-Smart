import { query } from "./_generated/server";

/**
 * Get all products ordered by name.
 * Convex queries are reactive — the UI updates automatically when data changes.
 */
export const listar = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("produtos")
      .order("asc")
      .collect();
  },
});
