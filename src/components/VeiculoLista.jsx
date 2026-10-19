import { useEffect, useState } from 'react'
import { listarVeiculos, removerVeiculo } from '../data/repository.js'
import {
  STATUS,
  infoStatus,
  calcularCustoTotal,
  calcularLucroEstimado,
} from '../data/modelos.js'
import { formatarBRL, formatarNumero } from '../utils/formato.js'

// Tela inicial: lista de veículos com filtro por status e busca por texto.
export default function VeiculoLista({ onNovo, onEditar }) {
  const [veiculos, setVeiculos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [busca, setBusca] = useState('')

  // Carrega a lista assim que a tela abre.
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

  // Conta quantos veículos existem em cada status (para mostrar nos filtros).
  function contar(statusValor) {
    if (statusValor === 'todos') return veiculos.length
    return veiculos.filter((v) => v.status === statusValor).length
  }

  // Aplica o filtro de status e a busca por texto.
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

  return (
    <section>
      <div className="lista-topo">
        <h2>Veículos</h2>
        <input
          type="search"
          className="busca"
          placeholder="Buscar por marca, modelo, cor ou placa…"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Filtros por status */}
      <div className="filtros">
        <button
          type="button"
          className={'chip' + (filtroStatus === 'todos' ? ' ativo' : '')}
          onClick={() => setFiltroStatus('todos')}
        >
          Todos <span className="chip__contador">{contar('todos')}</span>
        </button>
        {STATUS.map((s) => (
          <button
            key={s.valor}
            type="button"
            className={'chip' + (filtroStatus === s.valor ? ' ativo' : '')}
            onClick={() => setFiltroStatus(s.valor)}
          >
            {s.rotulo} <span className="chip__contador">{contar(s.valor)}</span>
          </button>
        ))}
      </div>

      {carregando && <p className="texto-suave">Carregando…</p>}

      {!carregando && filtrados.length === 0 && (
        <div className="vazio">
          {veiculos.length === 0 ? (
            <>
              <p>Nenhum veículo cadastrado ainda.</p>
              <button type="button" className="botao botao--primario" onClick={onNovo}>
                + Cadastrar o primeiro veículo
              </button>
            </>
          ) : (
            <p>Nenhum veículo encontrado para este filtro.</p>
          )}
        </div>
      )}

      <div className="grade-cards">
        {filtrados.map((veiculo) => {
          const status = infoStatus(veiculo.status)
          const custoTotal = calcularCustoTotal(veiculo)
          const lucro = calcularLucroEstimado(veiculo)
          const pendenciasAbertas = (veiculo.pendencias || []).filter(
            (p) => !p.resolvida,
          ).length
          const foto = (veiculo.fotos || [])[0]

          return (
            <article key={veiculo.id} className="card">
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
                    {veiculo.marca || 'Sem marca'} {veiculo.modelo}
                  </h3>
                  <span
                    className="badge"
                    style={{ backgroundColor: status.cor }}
                  >
                    {status.rotulo}
                  </span>
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

                {veiculo.placa && (
                  <p className="card__placa">{veiculo.placa}</p>
                )}

                <div className="card__precos">
                  <div>
                    <span className="texto-suave">Venda</span>
                    <strong className="valor-destaque">
                      {formatarBRL(veiculo.precoVenda)}
                    </strong>
                  </div>
                  <div>
                    <span className="texto-suave">Custo total</span>
                    <strong>{formatarBRL(custoTotal)}</strong>
                  </div>
                  <div>
                    <span className="texto-suave">Lucro estimado</span>
                    <strong className={lucro < 0 ? 'valor-negativo' : 'valor-positivo'}>
                      {formatarBRL(lucro)}
                    </strong>
                  </div>
                </div>

                {pendenciasAbertas > 0 && (
                  <p className="card__pendencias">
                    ⚠️ {pendenciasAbertas} pendência(s) em aberto
                  </p>
                )}

                <div className="card__acoes">
                  <button
                    type="button"
                    className="botao botao--neutro botao--pequeno"
                    onClick={() => onEditar(veiculo)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="botao botao--perigo botao--pequeno"
                    onClick={() => excluir(veiculo)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
