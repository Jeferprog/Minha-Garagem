import { useEffect, useState } from 'react'
import { listarVitrine, obterConfig } from '../data/repository.js'
import { infoStatus, formatarAno } from '../data/modelos.js'
import { formatarBRLCompacto, formatarNumero } from '../utils/formato.js'
import { linkWhatsApp } from '../utils/whatsapp.js'
import { tagFlutuante } from '../utils/estilos.js'
import { VEICULOS_EXEMPLO } from '../data/exemplos.js'
import GaleriaFotos from './GaleriaFotos.jsx'
import { IconeOlho, IconeWhatsapp } from './Icones.jsx'

// Banner de largura total (sangra para fora do padding do conteúdo).
function Faixa({ children }) {
  return <div className="faixa">{children}</div>
}

export default function Vitrine({ admin = false }) {
  const [veiculos, setVeiculos] = useState([])
  const [whatsapp, setWhatsapp] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([listarVitrine(), obterConfig()])
      .then(([lista, config]) => {
        setVeiculos(lista)
        setWhatsapp(config.whatsapp || '')
      })
      .catch((e) => setErro(e.message || 'Não foi possível carregar a vitrine.'))
      .finally(() => setCarregando(false))
  }, [])

  const usandoExemplos = !carregando && !erro && veiculos.length === 0
  const paraMostrar = usandoExemplos ? VEICULOS_EXEMPLO : veiculos
  const n = String(paraMostrar.length).padStart(2, '0')

  return (
    <section>
      {admin && (
        <Faixa>
          <IconeOlho size={16} />
          Prévia do site público — aparecem só os veículos à venda ou reservados.
        </Faixa>
      )}
      {usandoExemplos && (
        <Faixa>
          <IconeOlho size={16} />
          Veículos de exemplo (ilustração). Sem veículos à venda/reservados cadastrados.
        </Faixa>
      )}

      {carregando && <p className="text-muted" style={{ paddingTop: 24 }}>Carregando…</p>}
      {erro && (
        <div style={{ marginTop: 24, padding: '12px 16px', background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', fontWeight: 600 }}>
          {erro}
        </div>
      )}

      {!carregando && !erro && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              alignItems: 'end',
              padding: '48px 0 32px',
              borderBottom: '2px solid var(--color-divider)',
            }}
          >
            <h1 style={{ fontSize: 72, lineHeight: 0.92, letterSpacing: '-0.04em', margin: 0 }}>
              Seminovos
              <br />
              revisados.
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingBottom: 6 }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 40, lineHeight: 1, color: 'var(--color-accent)' }}>
                {n}
              </div>
              <div style={{ color: 'var(--color-neutral-700)' }}>
                veículos disponíveis agora. Fale direto com a gente pelo WhatsApp.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              overflow: 'hidden',
              marginLeft: -24,
            }}
          >
            {paraMostrar.map((v) => {
              const status = infoStatus(v.status)
              const pendVis = (v.pendencias || []).filter((p) => p.mostrarNoSite)
              const obs = pendVis
                .map((p) => (p.descricao || 'Observação') + (p.resolvida ? ' ✓' : ''))
                .join(' · ')
              const ano = formatarAno(v)
              const msg =
                `Olá! Tenho interesse no ${v.marca} ${v.modelo}` +
                `${ano ? ` (${ano})` : ''}. Vi no site de vocês.`
              const wa = linkWhatsApp(whatsapp, msg)
              const specs = [
                { r: 'Ano', v: ano || '—' },
                { r: 'Km', v: formatarNumero(v.quilometragem) },
                { r: 'Cor', v: v.cor || '—' },
              ]

              return (
                <article
                  key={v.id}
                  style={{
                    marginRight: -2,
                    borderRight: '2px solid var(--color-divider)',
                    borderBottom: '2px solid var(--color-divider)',
                    padding: '24px 24px 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <GaleriaFotos fotos={v.fotos} alt={`${v.marca} ${v.modelo}`}>
                    <span className="tag" style={{ position: 'absolute', top: 0, left: 0, ...tagFlutuante(v.status) }}>
                      {status.rotulo}
                    </span>
                  </GaleriaFotos>

                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
                      {v.marca}
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 24, lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                      {v.modelo}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)' }}>
                    {specs.map((s) => (
                      <div key={s.r} style={{ padding: '8px 0' }}>
                        <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
                          {s.r}
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {obs && <div style={{ fontSize: 13, color: 'var(--color-neutral-800)' }}>{obs}</div>}

                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 'auto' }}>
                    {v.mostrarPrecoNoSite ? formatarBRLCompacto(v.precoVenda) : 'Consulte'}
                  </div>

                  {wa ? (
                    <a
                      className="btn btn-primary"
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ minHeight: 44, justifyContent: 'space-between', color: 'var(--color-bg)' }}
                    >
                      Falar no WhatsApp
                      <IconeWhatsapp size={16} sw={2} />
                    </a>
                  ) : (
                    admin && (
                      <div style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>
                        Configure o número de WhatsApp em “Configurações”.
                      </div>
                    )
                  )}
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
