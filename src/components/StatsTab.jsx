import { useMemo, useState } from 'react'

export function StatsTab({ history, onClearHistory, loading }) {
  const currentYear = new Date().getFullYear()
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = () => {
    if (confirmReset) {
      onClearHistory()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
      setTimeout(() => setConfirmReset(false), 3000)
    }
  }

  // Process data for stats
  const stats = useMemo(() => {
    const data = {}
    history.forEach((entry) => {
      const year = new Date(entry.data).getFullYear()
      if (year !== currentYear) return

      if (!data[entry.nome]) {
        data[entry.nome] = { nome: entry.nome, total: 0, count: 0 }
      }
      data[entry.nome].total += entry.quantidade
      data[entry.nome].count += 1
    })

    return Object.values(data).sort((a, b) => b.total - a.total)
  }, [history, currentYear])

  const totalPurchases = history.filter(h => new Date(h.data).getFullYear() === currentYear).length
  const totalUnits = stats.reduce((sum, s) => sum + s.total, 0)

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton h-32 rounded-3xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-[#020617]">
      {/* ── Management Header ────────────────────────── */}
      <div className="px-4 py-3 flex justify-end">
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all animate-fade-in"
          style={{
            background: confirmReset ? 'rgba(244,63,94,0.15)' : 'transparent',
            border: `1px solid ${confirmReset ? 'rgba(244,63,94,0.4)' : 'rgba(71,85,105,0.2)'}`,
            color: confirmReset ? '#fb7185' : '#475569',
          }}
        >
          {confirmReset ? '⚠️ Limpar Agora?' : '🧹 Limpar Estatísticas'}
        </button>
      </div>

      {/* ── Annual Summary Card ──────────────────────── */}
      <div className="px-4 pb-6">
        <div className="glass-card rounded-[32px] p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <span className="text-8xl">📊</span>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-2">
            Resumo Anual {currentYear}
          </p>
          <h2 className="text-4xl font-black italic text-white mb-6">
            {totalUnits} <span className="text-lg uppercase italic opacity-50">Unidades</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/50">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Compras</p>
              <p className="text-xl font-black text-white">{totalPurchases}</p>
            </div>
            <div className="bg-slate-900/40 rounded-2xl p-4 border border-slate-800/50">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Artigos</p>
              <p className="text-xl font-black text-white">{stats.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Breakdown List ────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-12">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-6 px-4">
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-emerald-500 py-1 border-b-2 border-emerald-500/30">
              Pódio de Consumo
            </h3>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Quantidades</span>
          </div>

          {stats.length === 0 ? (
            <div className="py-20 text-center opacity-40">
              <div className="text-5xl mb-4">🏜️</div>
              <p className="text-sm font-medium text-slate-400">Ainda não há dados históricos.<br/>Começa a fazer compras!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stats.map((item, index) => (
                <div 
                  key={item.nome}
                  className="glass-card rounded-[24px] p-6 flex items-center justify-between group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-500 text-lg">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-black text-lg text-slate-100 tracking-tight">{item.nome}</p>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        {item.count} passagens no cesto
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right flex flex-col items-end">
                    <div className="text-2xl font-black text-emerald-400 leading-none">
                      {item.total}
                    </div>
                    <div className="h-1.5 w-16 bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-700/30">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" 
                        style={{ width: `${Math.min((item.total / stats[0].total) * 100, 100)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
