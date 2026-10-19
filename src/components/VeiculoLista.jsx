import { useEffect, useState } from 'react'
import { listarVeiculos, removerVeiculo } from '../data/repository.js'
import {
  STATUS,
  infoStatus,
  formatarAno,
  calcularCustoTotal,
  calcularLucroEstimado,
  calcularMargemPercentual,
  resumoInventario,
} from '../data/modelos.js'
import { formatarBRL, formatarBRLCompacto, formatarNumero } from '../utils/formato.js'
import {
  IconeBusca,
  IconeEditar,
  IconeLixeira,
  IconeAlerta,
  IconeCarro,
  IconeCarteira,
  IconeEtiqueta,
  IconeTendencia,
} from './Icones.jsx'

// Mostra uma porcentagem no padrão brasileiro. Ex.: 18.7 -> "18,7%"
function formatarPct(valor) {
  return valor.toFixed(1).replace('.', ',') + '%'
}

// Tela inicial: lista de veículos com indicadores, filtro por status e busca.
export default function VeiculoLista({ onNovo, onEditar }) {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    recarregar()
  }, [])

  async function recarregar() {
    setCarregando(true)
    const lista = await listarVeiculos()
    setVeiculos(lista)
    setCarregando(false)
  }

  async function excluir(veiculo) {
    const confirmou = window.confirm(
      `Excluir o veículo "${veiculo.marca} ${veiculo.modelo}"? Esta ação não pode ser desfeita.`,
    )
    if (!confirmou) return
    await removerVeiculo(veiculo.id)
    recarregar()
  }

  function contar(statusValor) {
    if (statusValor === 'todos') return veiculos.length
    return veiculos.filter((v) => v.status === statusValor).length
  }

  // Filtro de status + busca por texto.
  const termo = busca.trim().toLowerCase()
  const filtrados = veiculos.filter((v) => {
    const passaStatus = filtroStatus === 'todos' || v.status === filtroStatus
    const passaBusca =
      termo === '' ||
      [v.marca, v.modelo, v.cor, v.placa]
        .filter(Boolean)
        .some((texto) => String(texto).toLowerCase().includes(termo))
    return passaStatus && passaBusca
  })

  const resumo = resumoInventario(veiculos)
  const temVeiculos = veiculos.length > 0

  return (
    <section>
      {/* Cabeçalho da tela: título + busca */}
      <div className="lista-cabecalho">
        <div>
          <div className="lista-titulo">
            <h2>Veículos</h2>
            {temVeiculos && (
              <span className="pill-contagem">{resumo.total} no pátio</span>
            )}
          </div>
          <p className="lista-sub">
            Visão geral do estoque, custo investido e lucro estimado.
          </p>
        </div>

        {temVeiculos && (
          <div className="busca-wrap">
            <span className="busca-wrap__icone">
              <IconeBusca size={18} />
            </span>
            <input
              type="search"
              className="busca"
              placeholder="Buscar por marca, modelo, cor ou placa…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        )}
      </div>

      {carregando && <p className="texto-suave">Carregando…</p>}

      {/* Estado vazio: nenhum veículo cadastrado */}
      {!carregando && !temVeiculos && (
        <div className="vazio">
          <p>Nenhum veículo cadastrado ainda.</p>
          <button type="button" className="botao botao--primario" onClick={onNovo}>
            Cadastrar o primeiro veículo
          </button>
        </div>
      )}

      {!carregando && temVeiculos && (
        <>
          {/* Faixa de indicadores (KPIs) */}
          <div className="kpis">
            <div className="kpi">
              <div className="kpi__texto">
                <div className="kpi__rotulo">Veículos</div>
                <div className="kpi__valor">
                  {resumo.total}
                  <span className="kpi__sub">
                    {resumo.emEstoque} em estoque · {resumo.vendidos} vendidos
                  </span>
                </div>
              </div>
              <div className="kpi__icone kpi__icone--primaria">
                <IconeCarro size={22} />
              </div>
            </div>

            <div className="kpi">
              <div className="kpi__texto">
                <div className="kpi__rotulo">Custo em estoque</div>
                <div className="kpi__valor num">{formatarBRLCompacto(resumo.custoEstoque)}</div>
              </div>
              <div className="kpi__icone">
                <IconeCarteira size={22} />
              </div>
            </div>

            <div className="kpi">
              <div className="kpi__texto">
                <div className="kpi__rotulo">Venda estimada</div>
                <div className="kpi__valor kpi__valor--primaria num">
                  {formatarBRLCompacto(resumo.vendaEstoque)}
                </div>
              </div>
              <div className="kpi__icone kpi__icone--primaria">
                <IconeEtiqueta size={22} />
              </div>
            </div>

            <div className="kpi">
              <div className="kpi__texto">
                <div className="kpi__rotulo">Lucro estimado</div>
                <div className="kpi__valor kpi__valor--verde num">
                  {formatarBRLCompacto(resumo.lucroEstoque)}
                  {resumo.custoEstoque > 0 && (
                    <span
                      className={
                        'kpi__badge' +
                        (resumo.lucroEstoque < 0 ? ' kpi__badge--negativa' : '')
                      }
                    >
                      {resumo.lucroEstoque > 0 ? '+' : ''}
                      {formatarPct(resumo.margem)}
                    </span>
                  )}
                </div>
              </div>
              <div className="kpi__icone kpi__icone--verde">
                <IconeTendencia size={22} />
              </div>
            </div>
          </div>

          {/* Filtros por status */}
          <div className="filtros">
            <button
              type="button"
              className={'chip' + (filtroStatus === 'todos' ? ' ativo' : '')}
              onClick={() => setFiltroStatus('todos')}
            >
              <span>Todos</span>
              <span className="chip__contador">{contar('todos')}</span>
            </button>
            {STATUS.map((s) => (
              <button
                key={s.valor}
                type="button"
                className={'chip' + (filtroStatus === s.valor ? ' ativo' : '')}
                onClick={() => setFiltroStatus(s.valor)}
              >
                <span className={'chip__dot dot--' + s.valor}></span>
                <span>{s.rotulo}</span>
                <span className="chip__contador">({contar(s.valor)})</span>
              </button>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="vazio">
              <p>Nenhum veículo encontrado para este filtro.</p>
            </div>
          )}

          {/* Grade de cartões */}
          <div className="grade-cards">
            {filtrados.map((veiculo) => {
              const status = infoStatus(veiculo.status)
              const custoTotal = calcularCustoTotal(veiculo)
              const lucro = calcularLucroEstimado(veiculo)
              const margem = calcularMargemPercentual(veiculo)
              const abertas = (veiculo.pendencias || []).filter((p) => !p.resolvida)
              const descricoes = abertas.map((p) => p.descricao).filter(Boolean)
              const foto = (veiculo.fotos || [])[0]

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
                  <div className="card__midia">
                    {foto ? (
                      <img
                        className="card__foto"
                        src={foto}
                        alt={`${veiculo.marca} ${veiculo.modelo}`}
                      />
                    ) : (
                      <div className="card__foto card__sem-foto">
                        <IconeCarro size={48} />
                      </div>
                    )}
                    <span className={`badge badge--flutuante badge--${veiculo.status}`}>
                      <span className="badge__ponto"></span>
                      {status.rotulo}
                    </span>
                    {veiculo.placa && (
                      <span className="card__placa-foto">{veiculo.placa}</span>
                    )}
                  </div>

                  <div className="card__corpo">
                    <div>
                      <h3 className="card__titulo">
                        {veiculo.marca || 'Sem marca'} {veiculo.modelo}
                      </h3>
                      {detalhes && <p className="card__detalhes">{detalhes}</p>}
                    </div>

                    {abertas.length > 0 && (
                      <div className="card__alerta">
                        <IconeAlerta size={16} />
                        <span>
                          {abertas.length} pendência{abertas.length > 1 ? 's' : ''}
                          {descricoes.length > 0
                            ? ': ' + descricoes.join(', ')
                            : ' em aberto'}
                        </span>
                      </div>
                    )}

                    <div className="financeiro">
                      <div className="financeiro__linha">
                        <span className="financeiro__rotulo">Preço de venda</span>
                        <span className="financeiro__valor num">
                          {formatarBRL(veiculo.precoVenda)}
                        </span>
                      </div>
                      <div className="financeiro__linha">
                        <span className="financeiro__custo">Custo total</span>
                        <span className="financeiro__custo num">
                          {formatarBRL(custoTotal)}
                        </span>
                      </div>
                      <div
                        className={
                          'financeiro__margem' +
                          (lucro < 0 ? ' financeiro__margem--negativa' : '')
                        }
                      >
                        <span>Lucro estimado</span>
                        <span className="num">
                          {lucro > 0 ? '+' : ''}
                          {formatarBRL(lucro)}
                          {custoTotal > 0 ? ` (${formatarPct(margem)})` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="card__acoes">
                      <button
                        type="button"
                        className="botao botao--neutro botao--pequeno"
                        onClick={() => onEditar(veiculo)}
                      >
                        <IconeEditar size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="botao botao--perigo botao--pequeno"
                        onClick={() => excluir(veiculo)}
                      >
                        <IconeLixeira size={16} />
                        Excluir
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
