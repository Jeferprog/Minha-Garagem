import { novaPendencia, custoPendenciasResolvidas } from '../data/modelos.js'
import { formatarBRL } from '../utils/formato.js'

// Lista editável de pendências/avarias do veículo.
// Recebe a lista atual ("pendencias") e avisa o formulário quando ela
// muda, chamando "aoAlterar" com a nova lista.
export default function PendenciasEditor({ pendencias, aoAlterar }) {
  function adicionar() {
    aoAlterar([...pendencias, novaPendencia()])
  }

  function atualizar(id, campo, valor) {
    aoAlterar(
      pendencias.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
    )
  }

  function remover(id) {
    aoAlterar(pendencias.filter((p) => p.id !== id))
  }

  const subtotalResolvidas = custoPendenciasResolvidas({ pendencias })

  return (
    <div className="pendencias">
      {pendencias.length === 0 && (
        <p className="texto-suave">Nenhuma pendência cadastrada para este veículo.</p>
      )}

      {pendencias.map((p) => (
        <div key={p.id} className="pendencia">
          <div className="campo">
            <label>Descrição</label>
            <input
              type="text"
              value={p.descricao}
              placeholder="Ex.: arranhão na porta, ar-condicionado a consertar"
              onChange={(e) => atualizar(p.id, 'descricao', e.target.value)}
            />
          </div>

          <div className="pendencia__grade">
            <div className="campo">
              <label>Custo estimado</label>
              <div className="campo-moeda">
                <span className="campo-moeda__prefixo">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.custoEstimado}
                  onChange={(e) => atualizar(p.id, 'custoEstimado', e.target.value)}
                />
              </div>
            </div>
            <div className="campo">
              <label>Custo real</label>
              <div className="campo-moeda">
                <span className="campo-moeda__prefixo">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={p.custoReal}
                  onChange={(e) => atualizar(p.id, 'custoReal', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pendencia__opcoes">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={p.resolvida}
                onChange={(e) => atualizar(p.id, 'resolvida', e.target.checked)}
              />
              Resolvida
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={p.mostrarNoSite}
                onChange={(e) => atualizar(p.id, 'mostrarNoSite', e.target.checked)}
              />
              Mostrar no site
            </label>
            <button
              type="button"
              className="botao botao--perigo botao--pequeno"
              onClick={() => remover(p.id)}
            >
              Remover
            </button>
          </div>

          <p className="pendencia__dica texto-suave">
            Só o custo real das pendências marcadas como <strong>resolvidas</strong> entra
            no custo total do carro.
          </p>
        </div>
      ))}

      <div className="pendencias__rodape">
        <button type="button" className="botao botao--neutro" onClick={adicionar}>
          + Adicionar pendência
        </button>
        <span className="texto-suave">
          Custo das resolvidas: <strong className="num">{formatarBRL(subtotalResolvidas)}</strong>
        </span>
      </div>
    </div>
  )
}
