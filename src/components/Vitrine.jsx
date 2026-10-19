import { useEffect, useState } from 'react'
import { listarVeiculos } from '../data/repository.js'
import { infoStatus } from '../data/modelos.js'
import { formatarBRL, formatarNumero } from '../utils/formato.js'

// Prévia de como os veículos apareceriam no site público (vitrine).
// Aqui mostramos apenas os veículos "à venda" ou "reservado" e
// respeitamos as opções "mostrar preço no site" e "mostrar no site"
// de cada pendência. Esta tela é só uma prévia dentro do sistema.
export default function Vitrine() {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    listarVeiculos().then((lista) => {
      setVeiculos(lista)
      setCarregando(false)
    })
  }, [])

  const visiveis = veiculos.filter(
    (v) => v.status === 'a_venda' || v.status === 'reservado',
  )

  return (
    <section className="vitrine">
      <div className="vitrine__aviso">
        👁️ Prévia da vitrine. É assim que os veículos apareceriam no site
        público. Aparecem apenas os que estão <strong>à venda</strong> ou{' '}
        <strong>reservados</strong>.
      </div>

      {carregando && <p className="texto-suave">Carregando…</p>}

      {!carregando && visiveis.length === 0 && (
        <div className="vazio">
          <p>Nenhum veículo à venda ou reservado no momento.</p>
        </div>
      )}

      <div className="grade-cards">
        {visiveis.map((veiculo) => {
          const foto = (veiculo.fotos || [])[0]
          const status = infoStatus(veiculo.status)
          const pendenciasVisiveis = (veiculo.pendencias || []).filter(
            (p) => p.mostrarNoSite,
          )

          return (
            <article key={veiculo.id} className="card vitrine-card">
              {foto ? (
                <img className="card__foto" src={foto} alt={`${veiculo.marca} ${veiculo.modelo}`} />
              ) : (
                <div className="card__foto card__sem-foto" aria-hidden="true">
                  🚗
                </div>
              )}

              <div className="card__corpo">
                <div className="card__titulo-linha">
                  <h3 className="card__titulo">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  {veiculo.status === 'reservado' && (
                    <span className="badge" style={{ backgroundColor: status.cor }}>
                      {status.rotulo}
                    </span>
                  )}
                </div>

                <p className="card__detalhes texto-suave">
                  {[
                    veiculo.ano,
                    veiculo.cor,
                    veiculo.quilometragem !== '' && veiculo.quilometragem != null
                      ? `${formatarNumero(veiculo.quilometragem)} km`
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>

                <p className="vitrine-card__preco">
                  {veiculo.mostrarPrecoNoSite
                    ? formatarBRL(veiculo.precoVenda)
                    : 'Consulte'}
                </p>

                {pendenciasVisiveis.length > 0 && (
                  <div className="vitrine-card__observacoes">
                    <span className="texto-suave">Observações:</span>
                    <ul>
                      {pendenciasVisiveis.map((p) => (
                        <li key={p.id}>
                          {p.descricao || 'Observação'}
                          {p.resolvida ? ' (resolvido)' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
