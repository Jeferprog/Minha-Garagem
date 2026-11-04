import { useEffect, useState } from 'react'
import { listarVeiculos } from '../data/repository.js'
import {
  STATUS,
  infoStatus,
  formatarAno,
  calcularCustoTotal,
  calcularLucroEstimado,
  calcularMargemPercentual,
  diasEmEstoque,
  resumoInventario,
} from '../data/modelos.js'
import { formatarBRLCompacto, formatarNumero } from '../utils/formato.js'
import { tagStatus, tagFlutuante } from '../utils/estilos.js'
import { IconeBusca, IconeCarro, IconeSeta, IconeTabela, IconeGrade } from './Icones.jsx'

function pct(n) {
  return n.toFixed(1).replace('.', ',') + '%'
}

// Texto compacto de tempo em estoque (padrão do design: "Hoje", "23 dias").
function textoDias(veiculo) {
  if (veiculo.status === 'vendido') return 'Vendido'
  const d = diasEmEstoque(veiculo)
  if (d == null) return '—'
  if (d === 0) return 'Hoje'
  return d + (d === 1 ? ' dia' : ' dias')
}
function corDias(veiculo) {
  const d = diasEmEstoque(veiculo)
  return veiculo.status !== 'vendido' && d != null && d > 60
    ? 'var(--color-accent-700)'
    : 'var(--color-text)'
}

function lerVista() {
  try {
    return localStorage.getItem('minha-garagem:vista') || 'tabela'
  } catch {
    return 'tabela'
  }
}

// Tela "Pátio": inventário com indicadores, filtro, busca e duas visões.
export default function VeiculoLista({ onNovo, onEditar }) {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [vista, setVista] = useState(lerVista)

  useEffect(() => {
    recarregar()
  }, [])

  async function recarregar() {
    setCarregando(true)
    setErro('')
    try {
      setVeiculos(await listarVeiculos())
    } catch (e) {
      setErro(e.message || 'Não foi possível carregar os veículos.')
    } finally {
      setCarregando(false)
    }
  }

  function trocarVista(v) {
    setVista(v)
    try {
      localStorage.setItem('minha-garagem:vista', v)
    } catch {
      /* ignora */
    }
  }

  function contar(statusValor) {
    if (statusValor === 'todos') return veiculos.length
    return veiculos.filter((v) => v.status === statusValor).length
  }

  const termo = busca.trim().toLowerCase()
  const filtrados = veiculos.filter((v) => {
    const passaStatus = filtroStatus === 'todos' || v.status === filtroStatus
    const passaBusca =
      termo === '' ||
      [v.marca, v.modelo, v.cor, v.placa]
        .filter(Boolean)
        .some((t) => String(t).toLowerCase().includes(termo))
    return passaStatus && passaBusca
  })

  const temVeiculos = veiculos.length > 0
  const resumo = resumoInventario(veiculos)
  const abertasTot = veiculos
    .filter((v) => v.status !== 'vendido')
    .reduce((t, v) => t + (v.pendencias || []).filter((p) => !p.resolvida).length, 0)

  const kpis = [
    {
      rotulo: 'Em estoque',
      valor: String(resumo.emEstoque),
      sub: `${resumo.vendidos} vendido · ${abertasTot} pendências abertas`,
    },
    {
      rotulo: 'Custo investido',
      valor: formatarBRLCompacto(resumo.custoEstoque),
      sub: 'Compra + pendências resolvidas',
    },
    {
      rotulo: 'Venda estimada',
      valor: formatarBRLCompacto(resumo.vendaEstoque),
      sub: 'Soma dos preços anunciados',
    },
    {
      rotulo: 'Lucro estimado',
      valor: (resumo.lucroEstoque > 0 ? '+' : '') + formatarBRLCompacto(resumo.lucroEstoque),
      sub: resumo.custoEstoque > 0 ? 'Margem de ' + pct(resumo.margem) : '—',
      acento: true,
    },
  ]

  // Dados de exibição de cada veículo.
  function dadosLinha(v) {
    const custo = calcularCustoTotal(v)
    const lucro = calcularLucroEstimado(v)
    const margem = calcularMargemPercentual(v)
    const abertas = (v.pendencias || []).filter((p) => !p.resolvida).length
    const detalhes = [
      formatarAno(v),
      v.cor,
      v.quilometragem !== '' && v.quilometragem != null
        ? `${formatarNumero(v.quilometragem)} km`
        : null,
    ]
      .filter(Boolean)
      .join(' · ')
    return {
      custo,
      lucro,
      margem,
      abertas,
      detalhes,
      foto: (v.fotos || [])[0],
      titulo: `${v.marca || 'Sem marca'} ${v.modelo}`.trim(),
      lucroTxt: (lucro > 0 ? '+' : '') + formatarBRLCompacto(lucro),
      lucroCor: lucro < 0 ? 'var(--color-accent-700)' : 'var(--color-text)',
      pendTxt: abertas ? `${abertas} em aberto` : 'Nenhuma',
      pendCor: abertas ? 'var(--color-accent-700)' : 'var(--color-neutral-600)',
    }
  }

  return (
    <section>
      <div className="tela-head">
        <div>
          <div className="kicker">Controle interno</div>
          <h1 className="titulo-tela">
            Pátio
            {temVeiculos && (
              <span className="titulo-tela__contagem">{veiculos.length} veículos</span>
            )}
          </h1>
        </div>
        {temVeiculos && (
          <div className="busca-wrap">
            <span className="busca-wrap__icone">
              <IconeBusca size={16} />
            </span>
            <input
              type="search"
              className="input"
              placeholder="Buscar marca, modelo, cor ou placa"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        )}
      </div>

      {carregando && <p className="text-muted">Carregando…</p>}
      {erro && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--color-accent-100)',
            color: 'var(--color-accent-800)',
            fontWeight: 600,
          }}
        >
          {erro}
        </div>
      )}

      {/* Nenhum veículo cadastrado ainda */}
      {!carregando && !erro && !temVeiculos && (
        <div className="vazio">
          <div className="vazio__titulo">Nenhum veículo cadastrado.</div>
          <div className="text-muted">Comece cadastrando o primeiro veículo do pátio.</div>
          <button type="button" className="btn btn-primary" onClick={onNovo}>
            Cadastrar veículo
          </button>
        </div>
      )}

      {!carregando && !erro && temVeiculos && (
        <>
          {/* Faixa de KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              overflow: 'hidden',
              marginLeft: -20,
              borderTop: '2px solid var(--color-text)',
              marginBottom: 32,
            }}
          >
            {kpis.map((k) => (
              <div
                key={k.rotulo}
                style={{
                  marginRight: -2,
                  borderRight: '2px solid var(--color-divider)',
                  borderBottom: '2px solid var(--color-divider)',
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-neutral-700)',
                  }}
                >
                  {k.rotulo}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    fontSize: 34,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: k.acento ? 'var(--color-accent)' : 'var(--color-text)',
                  }}
                >
                  {k.valor}
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Filtros + alternador de visão */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div className="grupo">
              {[{ valor: 'todos', rotulo: 'Todos' }, ...STATUS].map((f) => (
                <button
                  key={f.valor}
                  type="button"
                  className={'grupo__opt' + (filtroStatus === f.valor ? ' ativo' : '')}
                  onClick={() => setFiltroStatus(f.valor)}
                >
                  {f.rotulo}
                  <span className="grupo__opt-n">{contar(f.valor)}</span>
                </button>
              ))}
            </div>
            <div className="grupo">
              <button
                type="button"
                title="Tabela"
                className={'grupo__opt grupo__icone' + (vista === 'tabela' ? ' ativo' : '')}
                onClick={() => trocarVista('tabela')}
              >
                <IconeTabela size={16} />
              </button>
              <button
                type="button"
                title="Cartões"
                className={'grupo__opt grupo__icone' + (vista === 'cartoes' ? ' ativo' : '')}
                onClick={() => trocarVista('cartoes')}
              >
                <IconeGrade size={16} />
              </button>
            </div>
          </div>

          {filtrados.length === 0 && (
            <div className="vazio">
              <div className="vazio__titulo">Nenhum veículo encontrado.</div>
              <div className="text-muted">Ajuste o filtro ou a busca.</div>
            </div>
          )}

          {/* Visão TABELA */}
          {vista === 'tabela' && filtrados.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ minWidth: 920, borderTop: '2px solid var(--color-divider)' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 8px 12px 0' }}>Veículo</th>
                    <th>Placa</th>
                    <th>Status</th>
                    <th>Em estoque</th>
                    <th style={{ textAlign: 'right' }}>Venda</th>
                    <th style={{ textAlign: 'right' }}>Custo</th>
                    <th style={{ textAlign: 'right' }}>Lucro</th>
                    <th>Pendências</th>
                    <th style={{ width: 32 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((v) => {
                    const d = dadosLinha(v)
                    const status = infoStatus(v.status)
                    return (
                      <tr key={v.id} onClick={() => onEditar(v)} style={{ cursor: 'pointer' }}>
                        <td style={{ padding: '12px 8px 12px 0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div
                              style={{
                                width: 72,
                                height: 48,
                                flex: 'none',
                                background: 'var(--color-neutral-300)',
                                display: 'grid',
                                placeItems: 'center',
                                color: 'var(--color-neutral-600)',
                                overflow: 'hidden',
                              }}
                            >
                              {d.foto ? (
                                <img
                                  className="grayscale"
                                  src={d.foto}
                                  alt=""
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              ) : (
                                <IconeCarro size={22} />
                              )}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 15 }}>{d.titulo}</div>
                              <div style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>
                                {d.detalhes}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, letterSpacing: '0.06em' }}>{v.placa || '—'}</td>
                        <td>
                          <span className="tag" style={tagStatus(v.status)}>
                            {status.rotulo}
                          </span>
                        </td>
                        <td style={{ fontSize: 13, color: corDias(v) }}>{textoDias(v)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>
                          {formatarBRLCompacto(v.precoVenda)}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--color-neutral-700)' }}>
                          {formatarBRLCompacto(d.custo)}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: d.lucroCor }}>
                          {d.lucroTxt}
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 400,
                              color: 'var(--color-neutral-700)',
                            }}
                          >
                            {d.custo > 0 ? pct(d.margem) : ''}
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: d.pendCor }}>{d.pendTxt}</td>
                        <td style={{ color: 'var(--color-neutral-600)' }}>
                          <IconeSeta size={16} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Visão CARTÕES */}
          {vista === 'cartoes' && filtrados.length > 0 && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                overflow: 'hidden',
                marginLeft: -16,
                borderTop: '2px solid var(--color-divider)',
              }}
            >
              {filtrados.map((v) => {
                const d = dadosLinha(v)
                const status = infoStatus(v.status)
                return (
                  <article
                    key={v.id}
                    onClick={() => onEditar(v)}
                    style={{
                      marginRight: -2,
                      borderRight: '2px solid var(--color-divider)',
                      borderBottom: '2px solid var(--color-divider)',
                      padding: '16px 16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16 / 10',
                        background: 'var(--color-neutral-300)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--color-neutral-600)',
                        overflow: 'hidden',
                      }}
                    >
                      {d.foto ? (
                        <img
                          className="grayscale"
                          src={d.foto}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <IconeCarro size={40} sw={1.5} />
                      )}
                      <span
                        className="tag"
                        style={{ position: 'absolute', top: 0, left: 0, ...tagFlutuante(v.status) }}
                      >
                        {status.rotulo}
                      </span>
                      {v.placa && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            background: 'var(--color-text)',
                            color: 'var(--color-bg)',
                            fontSize: 11,
                            letterSpacing: '0.08em',
                            padding: '3px 8px',
                          }}
                        >
                          {v.placa}
                        </span>
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontWeight: 800,
                          fontSize: 18,
                          lineHeight: 1.15,
                        }}
                      >
                        {d.titulo}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-neutral-700)' }}>
                        {d.detalhes}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        borderTop: '2px solid var(--color-divider)',
                        paddingTop: 10,
                        gap: 8,
                      }}
                    >
                      <ColunaValor rotulo="Venda" valor={formatarBRLCompacto(v.precoVenda)} peso={600} />
                      <ColunaValor rotulo="Custo" valor={formatarBRLCompacto(d.custo)} />
                      <ColunaValor rotulo="Lucro" valor={d.lucroTxt} peso={800} cor={d.lucroCor} />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        color: 'var(--color-neutral-700)',
                      }}
                    >
                      <span style={{ color: corDias(v) }}>{textoDias(v)}</span>
                      <span style={{ color: d.pendCor }}>{d.pendTxt}</span>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ColunaValor({ rotulo, valor, peso = 400, cor }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-neutral-700)',
        }}
      >
        {rotulo}
      </div>
      <div style={{ fontWeight: peso, color: cor || 'inherit' }}>{valor}</div>
    </div>
  )
}
