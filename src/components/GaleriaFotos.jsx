import { useState } from 'react'
import { IconeCarro, IconeVoltar, IconeSeta } from './Icones.jsx'
import Lightbox from './Lightbox.jsx'

// Galeria de fotos (vitrine). Foto 4:3 em preto e branco, com setas e
// contador quadrados. Clicar na foto abre o visualizador em cores.
export default function GaleriaFotos({ fotos, alt, children }) {
  const lista = fotos || []
  const [indice, setIndice] = useState(0)
  const [verLightbox, setVerLightbox] = useState(false)

  if (lista.length === 0) {
    return (
      <div className="gal-midia">
        <IconeCarro size={48} sw={1.25} />
        {children}
        <span className="gal-contador">Sem fotos</span>
      </div>
    )
  }

  const atual = Math.min(indice, lista.length - 1)
  const varias = lista.length > 1
  function ir(delta, e) {
    e.stopPropagation()
    setIndice((atual + delta + lista.length) % lista.length)
  }

  return (
    <div className="gal-midia">
      <img
        className="grayscale gal-foto"
        src={lista[atual]}
        alt={alt}
        loading="lazy"
        onClick={() => setVerLightbox(true)}
      />
      {children}
      {varias && (
        <>
          <button type="button" className="gal-seta gal-seta--esq" onClick={(e) => ir(-1, e)} aria-label="Foto anterior">
            <IconeVoltar size={16} />
          </button>
          <button type="button" className="gal-seta gal-seta--dir" onClick={(e) => ir(1, e)} aria-label="Próxima foto">
            <IconeSeta size={16} />
          </button>
        </>
      )}
      <span className="gal-contador">
        {atual + 1}/{lista.length}
      </span>

      {verLightbox && (
        <Lightbox fotos={lista} inicial={atual} alt={alt} onFechar={() => setVerLightbox(false)} />
      )}
    </div>
  )
}
