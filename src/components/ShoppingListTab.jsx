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
  const inCart = product.no_carrinho || false

  return (
    <div
      className={`list-item ${inCart ? 'in-cart' : ''}`}
      style={{
        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'manipulation',
        opacity: inCart ? 0.45 : 1,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: inCart ? 'rgba(30,41,59,0.2)' : 'rgba(30,41,59,0.4)',
        border: '1px solid',
        borderColor: inCart ? 'rgba(71,85,105,0.1)' : 'rgba(71,85,105,0.25)',
      }}
      onClick={(e) => { e.stopPropagation(); onCheck(product) }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Checkbox circle */}
      <div
        style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: '50%',
          border: `2.5px solid ${inCart ? '#10b981' : 'rgba(71,85,105,0.6)'}`,
          background: inCart ? '#10b981' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        {inCart && (
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontWeight: 700, fontSize: '0.95rem', color: inCart ? '#94a3b8' : '#f8fafc',
          textDecoration: inCart ? 'line-through' : 'none',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          transition: 'all 0.3s'
        }}>
          {product.nome}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: 1, fontWeight: 500 }}>
          {product.categoria}
        </p>
      </div>

      {/* Quantity pill */}
      {!inCart && (
        <div
          style={{
            flexShrink: 0, padding: '4px 10px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 800,
            background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.25)',
            color: '#fb7185', letterSpacing: '-0.02em',
          }}
        >
          {product.quantidade_pendente}
        </div>
      )}
    </div>
  )
}

export function ShoppingListTab({ products, onCheck, onFinish, onClearAll }) {
  const [confirmFinish, setConfirmFinish] = useState(false)

  // Split into Pending and Cart rows
  const pendingItems = products.filter((p) => p.quantidade_pendente > 0 && !p.no_carrinho)
  const cartItems = products.filter((p) => p.quantidade_pendente > 0 && p.no_carrinho)

  // Group pending by category
  const groupedPending = useMemo(() => {
    const groups = {}
    pendingItems.forEach((p) => {
      const cat = p.categoria || 'Outros'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(p)
    })
    const order = ['Frescos', 'Padaria', 'Laticínios', 'Carnes & Peixe', 'Mercearia', 'Bebidas', 'Congelados', 'Limpeza', 'Higiene', 'Outros']
    return order
      .filter((cat) => groups[cat])
      .map((cat) => ({ cat, items: groups[cat] }))
      .concat(Object.entries(groups).filter(([cat]) => !order.includes(cat)).map(([cat, items]) => ({ cat, items })))
  }, [pendingItems])

  const handleFinish = () => {
    if (confirmFinish) {
      onFinish()
      setConfirmFinish(false)
    } else {
      setConfirmFinish(true)
      setTimeout(() => setConfirmFinish(false), 3000)
    }
  }

  const noItems = pendingItems.length === 0 && cartItems.length === 0

  if (noItems) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in">
        <div className="text-7xl mb-6">🎉</div>
        <h2 className="text-2xl font-black italic mb-3" style={{ color: '#10b981' }}>
          Missão Cumprida!
        </h2>
        <p className="text-sm font-medium leading-relaxed" style={{ color: '#475569' }}>
          Tudo o que precisavas já está em casa ou no cesto.<br/>Bom proveito!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Checkout Header ────────────────────────────── */}
      <div className="px-4 py-6">
        <div className="glass-card rounded-3xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🛒</div>
              <div>
                <h3 className="font-black text-xl leading-none" style={{ color: '#f8fafc' }}>
                  {pendingItems.length} por comprar
                </h3>
                <p className="text-xs font-bold mt-1 text-slate-500 uppercase tracking-wider">
                  {cartItems.length} já no cesto de compras
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleFinish}
              disabled={cartItems.length === 0}
              className="flex-1 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:grayscale"
              style={{
                background: confirmFinish
                  ? 'linear-gradient(135deg, #fbbf24, #d97706)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                boxShadow: confirmFinish ? '0 10px 30px rgba(245,158,11,0.3)' : '0 10px 30px rgba(16,185,129,0.3)',
              }}
            >
              {confirmFinish ? '⚠️ CONFIRMAR FECHO?' : (
                <>✨ Finalizar Compras <span className="opacity-60">({cartItems.length})</span></>
              )}
            </button>
            <button
              onClick={onClearAll}
              className="px-4 rounded-2xl border border-slate-800 text-slate-600 hover:text-rose-500 transition-colors"
              title="Reset Total"
            >
              🗑
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable List ──────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-12">
        {/* PENDING SECTION */}
        {groupedPending.map(({ cat, items }) => (
          <div key={cat} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{CATEGORY_ICONS[cat] || '📦'}</span>
              <p className="category-header">{cat}</p>
              <div className="flex-1 h-px bg-slate-800/40" />
            </div>
            <div className="flex flex-col gap-2.5">
              {items.map((p) => (
                <ShoppingItem key={p._id} product={p} onCheck={onCheck} />
              ))}
            </div>
          </div>
        ))}

        {/* CART SECTION */}
        {cartItems.length > 0 && (
          <div className="mt-4 border-t border-slate-900 pt-8 pb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-8 bg-slate-800" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                Já no Cesto de Compras
              </p>
              <div className="h-px w-8 bg-slate-800" />
            </div>
            <div className="flex flex-col gap-2.5">
              {cartItems.map((p) => (
                <ShoppingItem key={p._id} product={p} onCheck={onCheck} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
