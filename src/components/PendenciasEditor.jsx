import { novaPendencia } from '../data/modelos.js'
import { IconeCheck, IconeMais } from './Icones.jsx'

// Lista editável de pendências/avarias (seção 04 da Ficha).
export default function PendenciasEditor({ pendencias, aoAlterar }) {
  function adicionar() {
    aoAlterar([...pendencias, novaPendencia()])
  }
  function atualizar(id, campo, valor) {
    aoAlterar(pendencias.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)))
  }
  function remover(id) {
    aoAlterar(pendencias.filter((p) => p.id !== id))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {pendencias.map((p) => (
        <div
          key={p.id}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1fr) 130px 130px',
            gap: 12,
            alignItems: 'end',
            padding: '16px 0',
            borderTop: '1px solid var(--color-divider)',
          }}
        >
          <div className="field">
            <label>Descrição</label>
            <input
              className="input"
              value={p.descricao}
              placeholder="Ex.: arranhão na porta"
              onChange={(e) => atualizar(p.id, 'descricao', e.target.value)}
              style={{ minHeight: 40, textDecoration: p.resolvida ? 'line-through' : 'none' }}
            />
          </div>
          <div className="field">
            <label>Estimado</label>
            <input
              className="input"
              type="number"
              min="0"
              value={p.custoEstimado}
              onChange={(e) => atualizar(p.id, 'custoEstimado', e.target.value)}
              style={{ minHeight: 40 }}
            />
          </div>
          <div className="field">
            <label>Real</label>
            <input
              className="input"
              type="number"
              min="0"
              value={p.custoReal}
              onChange={(e) => atualizar(p.id, 'custoReal', e.target.value)}
              style={{ minHeight: 40 }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
            <button
              type="button"
              className={'caixa-check' + (p.resolvida ? ' caixa-check--marcado' : '')}
              style={{ fontSize: 13 }}
              onClick={() => atualizar(p.id, 'resolvida', !p.resolvida)}
            >
              <span className="caixa-check__box">{p.resolvida && <IconeCheck size={12} />}</span>
              Resolvida
            </button>
            <button
              type="button"
              className={'caixa-check' + (p.mostrarNoSite ? ' caixa-check--marcado' : '')}
              style={{ fontSize: 13 }}
              onClick={() => atualizar(p.id, 'mostrarNoSite', !p.mostrarNoSite)}
            >
              <span className="caixa-check__box">{p.mostrarNoSite && <IconeCheck size={12} />}</span>
              Mostrar na vitrine
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => remover(p.id)}
              style={{ marginLeft: 'auto', fontSize: 13 }}
            >
              Remover
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid var(--color-divider)',
        }}
      >
        <button type="button" className="btn btn-secondary" onClick={adicionar}>
          <IconeMais size={14} sw={2.5} />
          Adicionar pendência
        </button>
        <span style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>
          Só o custo real das resolvidas entra no custo total.
        </span>
      </div>
    </div>
  )
}
