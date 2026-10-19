import { useEffect, useState } from 'react'
import { listarVeiculos } from '../data/repository.js'
import { infoStatus, formatarAno } from '../data/modelos.js'
import { formatarBRL, formatarNumero } from '../utils/formato.js'
import GaleriaFotos from './GaleriaFotos.jsx'

// Prévia de como os veículos apareceriam no site público (vitrine).
// Mostra apenas os veículos "à venda" ou "reservado" e respeita as
// opções "mostrar preço no site" e "mostrar no site" de cada pendência.
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
          const status = infoStatus(veiculo.status)
          const pendenciasVisiveis = (veiculo.pendencias || []).filter(
            (p) => p.mostrarNoSite,
          )

          const detalhes = [
            formatarAno(veiculo),
            veiculo.cor,
            veiculo.quilometragem !== '' && veiculo.quilometragem != null
              ? `${formatarNumero(veiculo.quilometragem)} km`
              : null,
          ]
            .filter(Boolean)
            .join(' • ')

          return (
            <article key={veiculo.id} className="card">
              <GaleriaFotos
                fotos={veiculo.fotos}
                alt={`${veiculo.marca} ${veiculo.modelo}`}
              >
                <span className={`badge badge--flutuante badge--${veiculo.status}`}>
                  <span className="badge__ponto"></span>
                  {status.rotulo}
                </span>
              </GaleriaFotos>

              <div className="card__corpo">
                <div>
                  <h3 className="card__titulo">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  {detalhes && <p className="card__detalhes">{detalhes}</p>}
                </div>

                <p className="vitrine-card__preco num">
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
