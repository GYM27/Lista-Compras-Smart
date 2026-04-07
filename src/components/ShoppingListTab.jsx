import { useMemo, useState } from 'react'

// Category icon mapping
const CATEGORY_ICONS = {
  'Frescos': '🥬',
  'Mercearia': '🛒',
  'Padaria': '🍞',
  'Carnes & Peixe': '🥩',
  'Laticínios': '🥛',
  'Bebidas': '🥤',
  'Congelados': '🧊',
  'Limpeza': '🧹',
  'Higiene': '🧼',
  'Outros': '📦',
}

function ShoppingItem({ product, onCheck }) {
  const [checking, setChecking] = useState(false)

  const handleCheck = () => {
    if (checking) return
    setChecking(true)
    onCheck(product)
  }

  return (
    <div
      className={`list-item ${checking ? 'success-flash' : ''}`}
      style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
      onClick={handleCheck}
    >
      {/* Checkbox circle */}
      <div
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: '50%',
          border: `2px solid ${checking ? '#10b981' : 'rgba(71,85,105,0.6)'}`,
          background: checking ? '#10b981' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        {checking && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.nome}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2, fontWeight: 500 }}>
          {product.categoria}
        </p>
      </div>

      {/* Quantity pill */}
      <div
        style={{
          flexShrink: 0,
          padding: '4px 12px',
          borderRadius: 10,
          fontSize: '0.85rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(190,18,60,0.15))',
          border: '1px solid rgba(244,63,94,0.4)',
          color: '#fb7185',
          letterSpacing: '-0.02em',
        }}
      >
        ×{product.quantidade_pendente}
      </div>
    </div>
  )
}

export function ShoppingListTab({ products, onCheck, onClearAll }) {
  const [confirmClear, setConfirmClear] = useState(false)

  // Only products with pending quantity
  const pendingProducts = useMemo(() => {
    return products.filter((p) => p.quantidade_pendente > 0)
  }, [products])

  // Group by category
  const grouped = useMemo(() => {
    const groups = {}
    pendingProducts.forEach((p) => {
      const cat = p.categoria || 'Outros'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    })
    // Sort categories
    const order = ['Frescos', 'Padaria', 'Laticínios', 'Carnes & Peixe', 'Mercearia', 'Bebidas', 'Congelados', 'Limpeza', 'Higiene', 'Outros']
    return order
      .filter((cat) => groups[cat])
      .map((cat) => ({ cat, items: groups[cat] }))
      .concat(
        Object.entries(groups)
          .filter(([cat]) => !order.includes(cat))
          .map(([cat, items]) => ({ cat, items }))
      )
  }, [pendingProducts])

  const totalItems = pendingProducts.length
  const totalUnits = pendingProducts.reduce((sum, p) => sum + p.quantidade_pendente, 0)

  const handleClearAll = () => {
    if (confirmClear) {
      onClearAll()
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-2xl font-black italic mb-2" style={{ color: '#10b981' }}>
          Tudo Comprado!
        </h2>
        <p className="text-sm font-medium" style={{ color: '#475569' }}>
          A lista de compras está vazia. Vai ao Catálogo marcar o que falta.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Header Stats ────────────────────────────── */}
      <div className="px-4 pt-4 pb-3">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: 'rgba(244,63,94,0.15)' }}
            >
              🛒
            </div>
            <div>
              <p className="font-black text-lg leading-none" style={{ color: '#f8fafc' }}>
                {totalItems} produtos
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: '#64748b' }}>
                {totalUnits} unidades no total
              </p>
            </div>
          </div>

          {/* Clear All Button */}
          <button
            onClick={handleClearAll}
            className="px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={{
              background: confirmClear
                ? 'linear-gradient(135deg, #f43f5e, #be123c)'
                : 'rgba(244,63,94,0.12)',
              border: confirmClear ? 'none' : '1px solid rgba(244,63,94,0.3)',
              color: confirmClear ? 'white' : '#f43f5e',
              boxShadow: confirmClear ? '0 4px 12px rgba(244,63,94,0.4)' : 'none',
            }}
          >
            {confirmClear ? '⚠ Confirmar?' : '🗑 Limpar Tudo'}
          </button>
        </div>
      </div>

      {/* ── Grouped List ─────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {grouped.map(({ cat, items }) => (
          <div key={cat} className="mb-5 animate-slide-up">
            {/* Category Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{CATEGORY_ICONS[cat] || '📦'}</span>
              <p className="category-header">
                {cat}
              </p>
              <div className="flex-1 h-px" style={{ background: 'rgba(71,85,105,0.2)' }} />
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(71,85,105,0.3)', color: '#64748b' }}
              >
                {items.length}
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-2">
              {items.map((product) => (
                <ShoppingItem key={product.id} product={product} onCheck={onCheck} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
