import { useState } from 'react'

export function QuantityModal({ product, onConfirm, onClose }) {
  const [qty, setQty] = useState(product.quantidade_pendente || 1)

  const presets = [1, 2, 3, 5, 6, 10, 12, 24]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
              Quantidade Rápida
            </p>
            <h3 className="text-xl font-black italic mt-0.5" style={{ color: '#f8fafc' }}>
              {product.nome}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'rgba(71,85,105,0.3)', color: '#94a3b8' }}
          >
            ✕
          </button>
        </div>

        {/* Big Number + +/- */}
        <div className="flex items-center justify-center gap-5 mb-6">
          <button
            className="num-btn"
            onClick={() => setQty(Math.max(0, qty - 1))}
          >
            −
          </button>
          <div
            className="text-5xl font-black text-center"
            style={{
              color: '#10b981',
              minWidth: 80,
              textShadow: '0 0 30px rgba(16,185,129,0.5)',
            }}
          >
            {qty}
          </div>
          <button
            className="num-btn"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>

        {/* Presets */}
        <div className="mb-6">
          <p className="text-xs font-semibold mb-2" style={{ color: '#64748b' }}>Quantidade Comum</p>
          <div className="flex flex-wrap gap-2">
            {presets.map((n) => (
              <button
                key={n}
                onClick={() => setQty(n)}
                className="px-3 py-1.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: qty === n ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(71,85,105,0.3)',
                  border: qty === n ? 'none' : '1px solid rgba(71,85,105,0.4)',
                  color: qty === n ? 'white' : '#94a3b8',
                  boxShadow: qty === n ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="btn-ghost flex-1 px-4 py-3 text-sm" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-primary flex-1 px-4 py-3 text-sm justify-center"
            onClick={() => onConfirm(qty)}
          >
            ✓ Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
