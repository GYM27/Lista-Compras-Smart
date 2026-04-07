import { useState, useEffect, useRef, useCallback } from 'react'

const LONG_PRESS_DURATION = 600 // ms

export function ProductCard({ product, onTap, onLongPress }) {
  const isMissing = product.quantidade_pendente > 0
  const [pressing, setPressing] = useState(false)
  const [pressProgress, setPressProgress] = useState(0)
  
  const timerRef = useRef(null)
  const progressRef = useRef(null)
  const startTimeRef = useRef(null)
  const longPressedRef = useRef(false)

  const startPress = useCallback((e) => {
    // Only handle primary button for mouse
    if (e.type === 'mousedown' && e.button !== 0) return
    
    // Prevent overlapping timers (Crucial for mobile)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    setPressing(true)
    longPressedRef.current = false
    startTimeRef.current = Date.now()
    setPressProgress(0)

    // Progress animation for long press
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / LONG_PRESS_DURATION, 1)
      setPressProgress(progress)
    }, 16) // ~60fps

    // Trigger long press
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true
      clearInterval(progressRef.current)
      setPressing(false)
      setPressProgress(0)
      onLongPress(product)
    }, LONG_PRESS_DURATION)
  }, [product, onLongPress])

  const endPress = useCallback((e) => {
    // Prevent Mouse events from firing after Touch (causes double tap on some mobile browsers)
    if (e.type === 'mouseup' && startTimeRef.current && (Date.now() - startTimeRef.current) > 1000) {
      return
    }

    const duration = Date.now() - (startTimeRef.current || Date.now())
    
    // Clear all timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    
    setPressing(false)
    setPressProgress(0)

    // If it wasn't a long press and duration was short, trigger TAP
    if (!longPressedRef.current && duration < LONG_PRESS_DURATION && duration > 10) {
      onTap(product)
    }
    
    timerRef.current = null
    startTimeRef.current = null
  }, [product, onTap])

  const cancelPress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
    setPressing(false)
    setPressProgress(0)
    timerRef.current = null
    startTimeRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  const getEmoji = () => {
    const name = product.nome.toLowerCase()
    const emojis = {
      leite: '🥛', pão: '🍞', ovos: '🥚', manteiga: '🧈', queijo: '🧀',
      iogurte: '🍦', frango: '🍗', carne: '🥩', peixe: '🐟', massa: '🍝',
      arroz: '🍚', feijão: '🫘', tomate: '🍅', alface: '🥬', cebola: '🧅',
      alho: '🧄', batata: '🥔', cenoura: '🥕', maçã: '🍎', banana: '🍌',
      laranja: '🍊', café: '☕', chá: '🍵', sumo: '🧃', água: '💧',
      vinho: '🍷', cerveja: '🍺', chocolate: '🍫', biscoito: '🍪',
      detergente: '🧴', sabão: '🧼', papel: '🧻', sal: '🧂', azeite: '🫒',
      farinha: '🌾', açúcar: '🍬', vinagre: '🍶', mostarda: '🌭',
      ketchup: '🥫', maionese: '🥫', atum: '🐟', salmão: '🐠',
      presunto: '🥓', salsicha: '🌭', iogurtes: '🍦', natas: '🥛',
    }
    for (const [key, emoji] of Object.entries(emojis)) {
      if (name.includes(key)) return emoji
    }
    // category fallback
    const cat = (product.categoria || '').toLowerCase()
    const catEmojis = {
      frescos: '🥬', limpeza: '🧹', mercearia: '🛒', bebidas: '🥤',
      padaria: '🍞', congelados: '🧊', higiene: '🧼', outros: '📦',
    }
    for (const [key, emoji] of Object.entries(catEmojis)) {
      if (cat.includes(key)) return emoji
    }
    return '🛍️'
  }

  return (
    <div
      className={`relative rounded-[24px] cursor-pointer select-none overflow-hidden ${isMissing ? 'card-missing' : 'card-have'}`}
      style={{ minHeight: 140, userSelect: 'none', touchAction: 'manipulation' }}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={cancelPress}
    >
      {/* Long press progress ring */}
      {pressing && (
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            background: `conic-gradient(rgba(245,158,11,0.5) ${pressProgress * 360}deg, transparent ${pressProgress * 360}deg)`,
            zIndex: 10,
            opacity: 0.7,
          }}
        />
      )}

      {/* Quantity Badge */}
      {isMissing && product.quantidade_pendente > 0 && (
        <div
          className="qty-badge absolute top-2.5 right-2.5 z-20 min-w-[28px] h-7 px-1.5 rounded-full flex items-center justify-center font-black text-sm"
          style={{
            background: 'linear-gradient(135deg, #f43f5e, #be123c)',
            boxShadow: '0 4px 12px rgba(244,63,94,0.5)',
            color: 'white',
          }}
        >
          x{product.quantidade_pendente}
        </div>
      )}

      {/* Frequency stars for elite shelf indicator */}
      {product.contador_frequencia > 5 && (
        <div className="absolute top-2.5 left-2.5 z-20">
          <div
            className="text-xs px-1.5 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            ⭐ {product.contador_frequencia}
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="flex flex-col items-center justify-center h-full p-3 gap-2" style={{ minHeight: 140 }}>
        {product.imagem_url ? (
          <img
            src={product.imagem_url}
            alt={product.nome}
            className="w-14 h-14 object-cover rounded-xl"
            style={{ filter: isMissing ? 'grayscale(0.8)' : 'none' }}
          />
        ) : (
          <div className="text-4xl" style={{ filter: isMissing ? 'grayscale(1)' : 'none' }}>
            {getEmoji()}
          </div>
        )}
        <p
          className="text-center font-bold leading-tight text-sm"
          style={{ color: isMissing ? '#94a3b8' : '#f8fafc' }}
        >
          {product.nome}
        </p>
        {product.categoria && (
          <span
            className="text-xs font-medium"
            style={{ color: isMissing ? '#475569' : '#64748b' }}
          >
            {product.categoria}
          </span>
        )}
      </div>

      {/* Missing status overlay bottom strip */}
      {isMissing && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-[24px]"
          style={{ background: 'linear-gradient(90deg, #f43f5e, #be123c)' }}
        />
      )}
    </div>
  )
}
