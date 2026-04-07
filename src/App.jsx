import { useState, useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import { CatalogTab } from './components/CatalogTab'
import { ShoppingListTab } from './components/ShoppingListTab'

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

// ────────────────────────────────────────────────────────
// CONVEX WRAPPER — handles the case where Convex is not
// yet provisioned (shows demo mode instead of crashing)
// ────────────────────────────────────────────────────────
function AppConvex() {
  const [activeTab, setActiveTab] = useState('catalog')

  // ── Convex reactive query — auto-updates on ALL devices ──
  const produtos = useQuery(api.produtos.listar)

  // ── Convex mutations ──────────────────────────────────────
  const tocar          = useMutation(api.mutations.tocar)
  const definirQtd     = useMutation(api.mutations.definirQuantidade)
  const marcarComprado = useMutation(api.mutations.marcarComprado)
  const limparTudo     = useMutation(api.mutations.limparTudo)
  const adicionar      = useMutation(api.mutations.adicionar)

  // loading state (Convex returns undefined while fetching)
  const loading = produtos === undefined
  const products = produtos ?? []
  const pendingCount = products.filter((p) => p.quantidade_pendente > 0).length

  // ── Handlers ──────────────────────────────────────────────

  const handleTap = useCallback(async (product) => {
    await tocar({ id: product._id })
  }, [tocar])

  const handleLongPress = useCallback(async (product, qty) => {
    await definirQtd({ id: product._id, quantidade: qty })
  }, [definirQtd])

  const handleCheck = useCallback(async (product) => {
    await marcarComprado({ id: product._id })
  }, [marcarComprado])

  const handleClearAll = useCallback(async () => {
    await limparTudo({})
  }, [limparTudo])

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
      loading={loading}
      pendingCount={pendingCount}
      onTap={handleTap}
      onLongPress={handleLongPress}
      onCheck={handleCheck}
      onClearAll={handleClearAll}
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

  const pendingCount = products.filter((p) => p.quantidade_pendente > 0).length

  const handleTap = useCallback((product) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p._id !== product._id) return p
        const isFirst = p.quantidade_pendente === 0
        return {
          ...p,
          quantidade_pendente: p.quantidade_pendente + 1,
          contador_frequencia: isFirst ? p.contador_frequencia + 1 : p.contador_frequencia,
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
          contador_frequencia: addFreq ? p.contador_frequencia + 1 : p.contador_frequencia,
        }
      })
    )
  }, [])

  const handleCheck = useCallback((product) => {
    setProducts((prev) =>
      prev.map((p) => p._id === product._id ? { ...p, quantidade_pendente: 0 } : p)
    )
  }, [])

  const handleClearAll = useCallback(() => {
    setProducts((prev) => prev.map((p) => ({ ...p, quantidade_pendente: 0 })))
  }, [])

  const handleAddProduct = useCallback((data) => {
    setProducts((prev) =>
      [...prev, {
        _id: `demo-${Date.now()}`,
        nome: data.nome,
        categoria: data.categoria,
        imagem_url: data.imagem_url || null,
        quantidade_pendente: 0,
        contador_frequencia: 0,
      }].sort((a, b) => a.nome.localeCompare(b.nome))
    )
  }, [])

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      products={products}
      loading={false}
      pendingCount={pendingCount}
      onTap={handleTap}
      onLongPress={handleLongPress}
      onCheck={handleCheck}
      onClearAll={handleClearAll}
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
  products, loading, pendingCount,
  onTap, onLongPress, onCheck, onClearAll, onAddProduct,
  usingDemo,
}) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#020617', fontFamily: "'Inter', system-ui, sans-serif" }}
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

      {/* ── Tab Bar ────────────────────────────────────── */}
      <nav style={{ flexShrink: 0, display: 'flex', padding: '10px 16px 8px', gap: 8, background: '#020617' }}>
        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 0', borderRadius: 18, fontWeight: 700, fontSize: '0.875rem',
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease',
            ...(activeTab === 'catalog'
              ? { background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }
              : { background: 'rgba(30,41,59,0.6)', color: '#64748b', border: '1px solid rgba(71,85,105,0.25)' }
            ),
          }}
        >
          🏪 Catálogo
        </button>

        <button
          onClick={() => setActiveTab('shopping')}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 0', borderRadius: 18, fontWeight: 700, fontSize: '0.875rem',
            cursor: 'pointer', border: 'none', transition: 'all 0.2s ease', position: 'relative',
            ...(activeTab === 'shopping'
              ? { background: 'linear-gradient(135deg, #f43f5e, #be123c)', color: 'white', boxShadow: '0 4px 20px rgba(244,63,94,0.4)' }
              : { background: 'rgba(30,41,59,0.6)', color: '#64748b', border: '1px solid rgba(71,85,105,0.25)' }
            ),
          }}
        >
          🛍 Lista
          {pendingCount > 0 && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              minWidth: 22, height: 22, padding: '0 5px', borderRadius: 999,
              fontSize: '0.7rem', fontWeight: 900,
              background: activeTab === 'shopping' ? 'rgba(255,255,255,0.3)' : '#f43f5e',
              color: 'white',
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
            onClearAll={onClearAll}
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
