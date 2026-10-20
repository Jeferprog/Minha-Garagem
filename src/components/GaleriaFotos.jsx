import { useState } from 'react'
import { IconeCarro } from './Icones.jsx'
import Lightbox from './Lightbox.jsx'

// Galeria de fotos de um veículo (usada na vitrine).
// Mostra a foto atual; quando há mais de uma, aparecem as setas, um
// contador (ex.: 2/4) e as miniaturas. Clicar na foto abre o visualizador
// em tela cheia (lightbox). "children" é um conteúdo sobreposto à foto
// (ex.: o selo de status).
export default function GaleriaFotos({ fotos, alt, children }) {
  const lista = fotos || []
  const [indice, setIndice] = useState(0)
  const [verLightbox, setVerLightbox] = useState(false)

  // Sem fotos: mostra o ícone de carro (placeholder).
  if (lista.length === 0) {
    return (
      <div className="card__midia">
        <div className="card__foto card__sem-foto">
          <IconeCarro size={48} />
        </div>
        {children}
      </div>
    )
  }

  const atual = Math.min(indice, lista.length - 1)
  const varias = lista.length > 1

  function ir(delta, evento) {
    evento.preventDefault()
    evento.stopPropagation()
    setIndice((atual + delta + lista.length) % lista.length)
  }

  return (
    <div>
      <div className="card__midia">
        <img
          className="card__foto galeria__foto"
          src={lista[atual]}
          alt={alt}
          loading="lazy"
          onClick={() => setVerLightbox(true)}
        />
        {children}
        {varias && (
          <>
            <button
              type="button"
              className="galeria__seta galeria__seta--esq"
              onClick={(e) => ir(-1, e)}
              aria-label="Foto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="galeria__seta galeria__seta--dir"
              onClick={(e) => ir(1, e)}
              aria-label="Próxima foto"
            >
              ›
            </button>
            <span className="galeria__contador">
              {atual + 1}/{lista.length}
            </span>
          </>
        )}
      </div>

      {varias && (
        <div className="galeria__miniaturas">
          {lista.map((foto, i) => (
            <button
              key={i}
              type="button"
              className={'galeria__mini' + (i === atual ? ' ativa' : '')}
              onClick={() => setIndice(i)}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={foto} alt="" />
            </button>
          ))}
        </div>
      )}

      {verLightbox && (
        <Lightbox
          fotos={lista}
          inicial={atual}
          alt={alt}
          onFechar={() => setVerLightbox(false)}
        />
      )}
    </div>
  )
}
