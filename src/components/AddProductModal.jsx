import { useState } from 'react'

const CATEGORIES = [
  'Frescos', 'Mercearia', 'Padaria', 'Carnes & Peixe',
  'Laticínios', 'Bebidas', 'Congelados', 'Limpeza',
  'Higiene', 'Outros',
]

export function AddProductModal({ initialName = '', onConfirm, onClose }) {
  const [nome, setNome] = useState(initialName)
  const [categoria, setCategoria] = useState('Outros')
  const [imagemUrl, setImagemUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nome.trim()) return
    onConfirm({ nome: nome.trim(), categoria, imagem_url: imagemUrl || null })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ minWidth: 340, maxWidth: 460, width: '90vw' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
              Novo Produto
            </p>
            <h3 className="text-xl font-black italic mt-0.5" style={{ color: '#f8fafc' }}>
              Adicionar à Dispensa
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

        <form onSubmit={handleSubmit}>
          {/* Nome */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#64748b' }}>
              Nome do Produto *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Leite Gordo, Detergente..."
              className="search-bar w-full px-4 py-3 text-sm font-medium"
              autoFocus
            />
          </div>

          {/* Categoria */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#64748b' }}>
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: categoria === cat ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'rgba(71,85,105,0.3)',
                    border: categoria === cat ? 'none' : '1px solid rgba(71,85,105,0.4)',
                    color: categoria === cat ? 'white' : '#94a3b8',
                    boxShadow: categoria === cat ? '0 4px 12px rgba(139,92,246,0.3)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Imagem URL (optional) */}
          <div className="mb-6">
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1.5" style={{ color: '#64748b' }}>
              URL da Imagem (opcional)
            </label>
            <input
              type="url"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://..."
              className="search-bar w-full px-4 py-3 text-sm font-medium"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" className="btn-ghost flex-1 px-4 py-3 text-sm" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 px-4 py-3 text-sm justify-center"
              disabled={!nome.trim()}
              style={{ opacity: nome.trim() ? 1 : 0.5 }}
            >
              ＋ Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
