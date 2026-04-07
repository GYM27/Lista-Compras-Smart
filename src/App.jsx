import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { CatalogTab } from './components/CatalogTab'
import { ShoppingListTab } from './components/ShoppingListTab'
import { StatsTab } from './components/StatsTab'

// ────────────────────────────────────────────────────────
// DEMO SEED DATA — used when Convex is not yet connected
// (i.e. _generated/api doesn't exist yet)
// ────────────────────────────────────────────────────────
const DEMO_PRODUCTS = [
  { _id: '1', nome: 'Leite', categoria: 'Laticínios', quantidade_pendente: 2, contador_frequencia: 12 },
  { _id: '2', nome: 'Pão de Forma', categoria: 'Padaria', quantidade_pendente: 0, contador_frequencia: 20 },
  { _id: '3', nome: 'Ovos', categoria: 'Frescos', quantidade_pendente: 1, contador_frequencia: 18 },
  { _id: '4', nome: 'Manteiga', categoria: 'Laticínios', quantidade_pendente: 0, contador_frequencia: 8 },
  { _id: '5', nome: 'Queijo Flamengo', categoria: 'Laticínios', quantidade_pendente: 0, contador_frequencia: 10 },
  { _id: '6', nome: 'Iogurte Natural', categoria: 'Laticínios', quantidade_pendente: 3, contador_frequencia: 9 },
  { _id: '7', nome: 'Frango', categoria: 'Carnes & Peixe', quantidade_pendente: 0, contador_frequencia: 15 },
  { _id: '8', nome: 'Massa Esparguete', categoria: 'Mercearia', quantidade_pendente: 0, contador_frequencia: 7 },
  { _id: '9', nome: 'Arroz', categoria: 'Mercearia', quantidade_pendente: 1, contador_frequencia: 11 },
  { _id: '10', nome: 'Tomate', categoria: 'Frescos', quantidade_pendente: 0, contador_frequencia: 14 },
  { _id: '11', nome: 'Cebola', categoria: 'Frescos', quantidade_pendente: 0, contador_frequencia: 16 },
  { _id: '12', nome: 'Detergente Loiça', categoria: 'Limpeza', quantidade_pendente: 1, contador_frequencia: 6 },
  { _id: '13', nome: 'Papel Higiénico', categoria: 'Higiene', quantidade_pendente: 0, contador_frequencia: 13 },
  { _id: '14', nome: 'Água', categoria: 'Bebidas', quantidade_pendente: 6, contador_frequencia: 22 },
  { _id: '15', nome: 'Azeite', categoria: 'Mercearia', quantidade_pendente: 0, contador_frequencia: 9 },
  { _id: '16', nome: 'Café', categoria: 'Mercearia', quantidade_pendente: 0, contador_frequencia: 25 },
  { _id: '17', nome: 'Banana', categoria: 'Frescos', quantidade_pendente: 0, contador_frequencia: 12 },
  { _id: '18', nome: 'Maçã', categoria: 'Frescos', quantidade_pendente: 2, contador_frequencia: 8 },
  { _id: '19', nome: 'Sabão Roupa', categoria: 'Limpeza', quantidade_pendente: 0, contador_frequencia: 5 },
  { _id: '20', nome: 'Salsicha', categoria: 'Carnes & Peixe', quantidade_pendente: 0, contador_frequencia: 4 },
]

const DEMO_HISTORY = [
  { _id: 'h1', nome: 'Leite', quantidade: 12, data: Date.now() - 1000 * 60 * 60 * 24 * 5 },
  { _id: 'h2', nome: 'Pão de Forma', quantidade: 5, data: Date.now() - 1000 * 60 * 60 * 24 * 10 },
  { _id: 'h3', nome: 'Café', quantidade: 3, data: Date.now() - 1000 * 60 * 60 * 24 * 2 },
]

// ────────────────────────────────────────────────────────
// CONVEX WRAPPER — handles the case where Convex is not
// yet provisioned (shows demo mode instead of crashing)
// ────────────────────────────────────────────────────────
function AppConvex() {
  const [activeTab, setActiveTab] = useState('catalog')

  // ── Convex reactive queries ──
  const produtos = useQuery(api.produtos.listar)
  const historico = useQuery(api.produtos.listarHistorico)

  // ── Convex mutations ──────────────────────────────────────
  const tocar          = useMutation(api.mutations.tocar)
  const definirQtd     = useMutation(api.mutations.definirQuantidade)
  const marcarNoCesto  = useMutation(api.mutations.marcarNoCesto)
  const limparCesto    = useMutation(api.mutations.limparCesto)
  const limparTudo     = useMutation(api.mutations.limparTudo)
  const limparHistorico = useMutation(api.mutations.limparHistorico)
  const adicionar      = useMutation(api.mutations.adicionar)

  // loading state
  const loading = produtos === undefined || historico === undefined
  const products = produtos ?? []
  const history = historico ?? []
  const pendingCount = products.filter((p) => p.quantidade_pendente > 0).length

  // ── Handlers ──────────────────────────────────────────────

  const handleTap = useCallback(async (product) => {
    await tocar({ id: product._id })
  }, [tocar])

  const handleLongPress = useCallback(async (product, qty) => {
    await definirQtd({ id: product._id, quantidade: qty })
  }, [definirQtd])

  const handleCheck = useCallback(async (product) => {
    await marcarNoCesto({ id: product._id })
  }, [marcarNoCesto])

  const handleFinishShopping = useCallback(async () => {
    await limparCesto({})
  }, [limparCesto])

  const handleHardReset = useCallback(async () => {
    await limparTudo({})
  }, [limparTudo])

  const handleClearHistory = useCallback(async () => {
    await limparHistorico({})
  }, [limparHistorico])

  const handleAddProduct = useCallback(async (data) => {
    await adicionar({
      nome: data.nome,
      categoria: data.categoria,
      imagem_url: data.imagem_url || undefined,
    })
  }, [adicionar])

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      products={products}
      history={history}
      loading={loading}
      pendingCount={pendingCount}
      onTap={handleTap}
      onLongPress={handleLongPress}
      onCheck={handleCheck}
      onFinish={handleFinishShopping}
      onClearAll={handleHardReset}
      onClearHistory={handleClearHistory}
      onAddProduct={handleAddProduct}
      usingDemo={false}
    />
  )
}

// ────────────────────────────────────────────────────────
// DEMO MODE — full local state, no backend needed
// ────────────────────────────────────────────────────────
function AppDemo() {
  const [activeTab, setActiveTab] = useState('catalog')
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [history, setHistory] = useState(DEMO_HISTORY)

  const pendingCount = products.filter((p) => p.quantidade_pendente > 0).length

  const handleTap = useCallback((product) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== product._id) return p
        const isInList = p.quantidade_pendente > 0
        if (isInList) {
          return { ...p, quantidade_pendente: 0, no_carrinho: false }
        } else {
          return {
            ...p,
            quantidade_pendente: 1,
            no_carrinho: false,
            contador_frequencia: p.contador_frequencia + 1,
          }
        }
      })
    )
  }, [])

  const handleLongPress = useCallback((product, qty) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== product._id) return p
        const addFreq = p.quantidade_pendente === 0 && qty > 0
        return {
          ...p,
          quantidade_pendente: qty,
          no_carrinho: false,
          contador_frequencia: addFreq ? p.contador_frequencia + 1 : p.contador_frequencia,
        }
      })
    )
  }, [])

  const handleCheck = useCallback((product) => {
    setProducts((prev) =>
      prev.map((p) => p._id === product._id ? { ...p, no_carrinho: !p.no_carrinho } : p)
    )
  }, [])

  const handleFinishShopping = useCallback(() => {
    const panier = products.filter(p => p.no_carrinho)
    const newHistory = panier.map(p => ({ _id: `h-${Date.now()}-${p._id}`, nome: p.nome, quantidade: p.quantidade_pendente, data: Date.now() }))
    setHistory(prev => [...newHistory, ...prev])
    setProducts((prev) => 
      prev.map((p) => p.no_carrinho ? { ...p, quantidade_pendente: 0, no_carrinho: false } : p)
    )
  }, [products])

  const handleClearAll = useCallback(() => {
    setProducts((prev) => prev.map((p) => ({ ...p, quantidade_pendente: 0, no_carrinho: false })))
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const handleAddProduct = useCallback((data) => {
    setProducts((prev) =>
      [...prev, {
        _id: `demo-${Date.now()}`,
        nome: data.nome,
        categoria: data.categoria,
        imagem_url: data.imagem_url || null,
        quantidade_pendente: 0,
        no_carrinho: false,
        contador_frequencia: 0,
      }].sort((a, b) => a.nome.localeCompare(b.nome))
    )
  }, [])

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      products={products}
      history={history}
      loading={false}
      pendingCount={pendingCount}
      onTap={handleTap}
      onLongPress={handleLongPress}
      onCheck={handleCheck}
      onFinish={handleFinishShopping}
      onClearAll={handleClearAll}
      onClearHistory={handleClearHistory}
      onAddProduct={handleAddProduct}
      usingDemo={true}
    />
  )
}

// ────────────────────────────────────────────────────────
// SHARED UI SHELL — same layout for both modes
// ────────────────────────────────────────────────────────
function AppShell({
  activeTab, setActiveTab,
  products, history, loading, pendingCount,
  onTap, onLongPress, onCheck, onFinish, onClearAll, onClearHistory, onAddProduct,
  usingDemo,
}) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100dvh',
        background: '#020617', padding: '2px', // Global safety margin
        fontFamily: "'Inter', system-ui, sans-serif"
      }}
    >
      {/* ── Top Header ─────────────────────────────────── */}
      <header
        style={{
          flexShrink: 0,
          padding: '14px 20px 10px',
          background: 'linear-gradient(180deg, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.85) 100%)',
          borderBottom: '1px solid rgba(71,85,105,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 900, fontStyle: 'italic', color: '#f8fafc', margin: 0 }}>
              🛒 Dispensa<span style={{ color: '#10b981' }}>Smart</span>
            </h1>
            <p style={{ fontSize: '0.7rem', fontWeight: 500, color: '#334155', marginTop: 2 }}>
              Gestão de Compras Doméstica
            </p>
          </div>
          {usingDemo && (
            <div style={{
              padding: '4px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700,
              background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b',
            }}>
              DEMO
            </div>
          )}
        </div>
      </header>

      {/* ── Triple Tab Bar ────────────────────────────────────── */}
      <nav style={{ flexShrink: 0, display: 'flex', padding: '10px 16px 8px', gap: 6, background: '#020617' }}>
        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px 0', borderRadius: 18, fontWeight: 700, fontSize: '0.8rem',
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
            ...(activeTab === 'catalog'
              ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }
              : { background: 'rgba(30,41,59,0.4)', color: '#64748b', border: '1px solid rgba(71,85,105,0.2)' }
            ),
          }}
        >
          🏪 Catálogo
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px 0', borderRadius: 18, fontWeight: 700, fontSize: '0.8rem',
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
            ...(activeTab === 'stats'
              ? { background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', color: 'white', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }
              : { background: 'rgba(30,41,59,0.4)', color: '#64748b', border: '1px solid rgba(71,85,105,0.2)' }
            ),
          }}
        >
          📊 Stats
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            padding: '12px 0', borderRadius: 18, fontWeight: 700, fontSize: '0.8rem',
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease', position: 'relative',
            ...(activeTab === 'shopping'
              ? { background: 'linear-gradient(135deg, #f43f5e, #be123c)', color: 'white', boxShadow: '0 4px 20px rgba(244,63,94,0.4)' }
              : { background: 'rgba(30,41,59,0.4)', color: '#64748b', border: '1px solid rgba(71,85,105,0.2)' }
            ),
          }}
        >
          🛍 Lista
          {pendingCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 18, height: 18, borderRadius: 999,
              fontSize: '0.65rem', fontWeight: 900,
              background: activeTab === 'shopping' ? 'rgba(255,255,255,0.3)' : '#f43f5e',
              color: 'white', marginLeft: 4
            }}>
              {pendingCount}
            </span>
          )}
        </button>
      </nav>

      {/* ── Tab Content ────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ display: activeTab === 'catalog' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
          <CatalogTab
            products={products}
            onTap={onTap}
            onLongPress={onLongPress}
            onAddProduct={onAddProduct}
            loading={loading}
          />
        </div>
        <div style={{ display: activeTab === 'shopping' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
          <ShoppingListTab
            products={products}
            onCheck={onCheck}
            onFinish={onFinish}
            onClearAll={onClearAll}
          />
        </div>
        <div style={{ display: activeTab === 'stats' ? 'flex' : 'none', flexDirection: 'column', height: '100%' }}>
          <StatsTab
            history={history}
            onClearHistory={onClearHistory}
            loading={loading}
          />
        </div>
      </main>

      {/* ── Demo / Status Banner ───────────────────────── */}
      {usingDemo && (
        <div style={{
          flexShrink: 0, padding: '6px 16px', textAlign: 'center', fontSize: '0.72rem', fontWeight: 600,
          background: 'rgba(245,158,11,0.08)', borderTop: '1px solid rgba(245,158,11,0.2)', color: '#78716c',
        }}>
          Modo Demo · Corre <code style={{ color: '#f59e0b', fontFamily: 'monospace' }}>npx convex dev</code> para ativar sincronização em tempo real
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────
// ROOT EXPORT — tries Convex, falls back to Demo
// ────────────────────────────────────────────────────────
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

export default function App() {
  // If VITE_CONVEX_URL is not set, run in pure demo mode
  // (ConvexProvider is set up in main.jsx only when URL exists)
  if (!CONVEX_URL) {
    return <AppDemo />
  }
  return <AppConvex />
}
