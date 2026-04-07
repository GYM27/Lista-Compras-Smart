import { useState, useMemo, useCallback } from "react";
import { ProductCard } from "./ProductCard";
import { QuantityModal } from "./QuantityModal";
import { AddProductModal } from "./AddProductModal";

const ALL_CATEGORIES = "Todos";

export function CatalogTab({
  products,
  onTap,
  onLongPress,
  onAddProduct,
  loading,
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);
  const [longPressProduct, setLongPressProduct] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");

  // Derive unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.categoria).filter(Boolean))];
    return [ALL_CATEGORIES, ...cats.sort()];
  }, [products]);

  // Elite shelf: top 10 by frequency that are "Tenho" (qty = 0)
  const eliteProducts = useMemo(() => {
    return products
      .filter((p) => p.quantidade_pendente === 0 && p.contador_frequencia > 0)
      .sort((a, b) => b.contador_frequencia - a.contador_frequencia)
      .slice(0, 10);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.nome.toLowerCase().includes(q));
    }
    if (activeCategory !== ALL_CATEGORIES) {
      list = list.filter((p) => p.categoria === activeCategory);
    }
    return list;
  }, [products, search, activeCategory]);

  const productExists = useMemo(() => {
    return (
      search.trim() &&
      products.some((p) => p.nome.toLowerCase() === search.trim().toLowerCase())
    );
  }, [search, products]);

  const handleLongPress = useCallback((product) => {
    setLongPressProduct(product);
  }, []);

  const handleQtyConfirm = useCallback(
    (qty) => {
      if (longPressProduct) {
        onLongPress(longPressProduct, qty);
        setLongPressProduct(null);
      }
    },
    [longPressProduct, onLongPress],
  );

  const handleAddProduct = useCallback(
    (data) => {
      onAddProduct(data);
      setShowAdd(false);
      setSearch("");
    },
    [onAddProduct],
  );

  const openAddModal = () => {
    setAddName(search);
    setShowAdd(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── Search Bar ───────────────────────────────── */}
      <div className="px-4 mt-10 mb-14 flex gap-3">
        <div className="relative flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="search-bar w-full px-4 pr-4 py-3 text-sm font-medium"
          />
        </div>
        <button
          className="btn-primary px-4 py-3 text-sm"
          onClick={() => {
            setAddName("");
            setShowAdd(true);
          }}
          title="Adicionar produto"
        >
          <span className="text-lg leading-none">＋</span>
        </button>
      </div>

      {/* "Create" hint when search yields no match */}
      {search.trim() && !productExists && filteredProducts.length === 0 && (
        <div className="px-4 pb-3 animate-slide-up">
          <button
            onClick={openAddModal}
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.1))",
              border: "1px dashed rgba(139,92,246,0.5)",
              color: "#a78bfa",
            }}
          >
            <span className="text-lg">＋</span> Criar Card para "{search}"
          </button>
        </div>
      )}

      {/* ── Category Chips ───────────────────────────── */}
      <div
        className="flex gap-2 px-4 pb-3 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Scrollable Grid Area ─────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {loading ? (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 140, borderRadius: 24 }}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Elite Shelf */}
            {eliteProducts.length > 0 &&
              !search.trim() &&
              activeCategory === ALL_CATEGORIES && (
                <div className="mb-8 pt-2">
                  <div className="flex flex-col items-center mb-6">
                    <h2
                      className="text-xs font-black uppercase tracking-[0.3em] py-1.5 px-6 rounded-full"
                      style={{
                        color: "#f59e0b",
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                      }}
                    >
                      TOP {eliteProducts.length}
                    </h2>
                  </div>
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(140px, 1fr))",
                    }}
                  >
                    {eliteProducts.map((p) => (
                      <ProductCard
                        key={p._id}
                        product={p}
                        onTap={onTap}
                        onLongPress={handleLongPress}
                      />
                    ))}
                  </div>
                </div>
              )}

            {/* Divider between elite and main grid */}
            {eliteProducts.length > 0 &&
              !search.trim() &&
              activeCategory === ALL_CATEGORIES && (
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(71,85,105,0.3)" }}
                  />
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#334155" }}
                  >
                    Todos os Produtos
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "rgba(71,85,105,0.3)" }}
                  />
                </div>
              )}

            {/* Main Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className="grid gap-3"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                }}
              >
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onTap={onTap}
                    onLongPress={handleLongPress}
                  />
                ))}
              </div>
            ) : (
              !search.trim() && (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">🛒</div>
                  <p
                    className="font-bold text-lg mb-2"
                    style={{ color: "#64748b" }}
                  >
                    Nenhum produto na dispensa
                  </p>
                  <p className="text-sm mb-6" style={{ color: "#334155" }}>
                    Adiciona o primeiro produto à tua cozinha!
                  </p>
                  <button
                    className="btn-primary px-6 py-3 text-sm justify-center"
                    onClick={() => setShowAdd(true)}
                  >
                    ＋ Adicionar Produto
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {longPressProduct && (
        <QuantityModal
          product={longPressProduct}
          onConfirm={handleQtyConfirm}
          onClose={() => setLongPressProduct(null)}
        />
      )}
      {showAdd && (
        <AddProductModal
          initialName={addName}
          onConfirm={handleAddProduct}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
