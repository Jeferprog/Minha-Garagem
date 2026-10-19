import { useEffect, useState } from 'react'

// Visualizador de fotos em tela cheia (abre ao clicar numa foto da vitrine).
// Permite navegar entre as fotos pelas setas ou pelo teclado (← → Esc).
export default function Lightbox({ fotos, inicial = 0, alt, onFechar }) {
  const total = fotos.length
  const [indice, setIndice] = useState(inicial)

  useEffect(() => {
    function aoTeclar(e) {
      if (e.key === 'Escape') onFechar()
      else if (e.key === 'ArrowLeft') setIndice((i) => (i - 1 + total) % total)
      else if (e.key === 'ArrowRight') setIndice((i) => (i + 1) % total)
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [total, onFechar])

  function ir(delta, e) {
    e.stopPropagation()
    setIndice((i) => (i + delta + total) % total)
  }

  return (
    <div className="lightbox" onClick={onFechar}>
      <button
        type="button"
        className="lightbox__fechar"
        onClick={onFechar}
        aria-label="Fechar"
      >
        ×
      </button>

      <img
        className="lightbox__img"
        src={fotos[indice]}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />

      {total > 1 && (
        <>
          <button
            type="button"
            className="lightbox__seta lightbox__seta--esq"
            onClick={(e) => ir(-1, e)}
            aria-label="Foto anterior"
          >
            ‹
          </button>
          <button
            type="button"
            className="lightbox__seta lightbox__seta--dir"
            onClick={(e) => ir(1, e)}
            aria-label="Próxima foto"
          >
            ›
          </button>
          <span className="lightbox__contador">
            {indice + 1}/{total}
          </span>
        </>
      )}
    </div>
  )
}
