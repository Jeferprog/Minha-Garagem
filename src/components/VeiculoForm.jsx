import { useRef, useState } from 'react'
import { salvarVeiculo, enviarFoto, removerVeiculo } from '../data/repository.js'
import {
  STATUS,
  novoVeiculo,
  infoStatus,
  calcularCustoTotal,
  calcularLucroEstimado,
  calcularMargemPercentual,
  custoPendenciasResolvidas,
} from '../data/modelos.js'
import { formatarBRLCompacto, redimensionarImagem } from '../utils/formato.js'
import PendenciasEditor from './PendenciasEditor.jsx'
import { IconeVoltar, IconeAlerta, IconeCheck, IconeX, IconeMais, IconeLixeira } from './Icones.jsx'

function pct(n) {
  return n.toFixed(1).replace('.', ',') + '%'
}

const CAMPOS = [
  { k: 'marca', label: 'Marca *', type: 'text', ph: 'Ex.: Volkswagen' },
  { k: 'modelo', label: 'Modelo *', type: 'text', ph: 'Ex.: Gol 1.0' },
  { k: 'ano', label: 'Ano fabricação', type: 'number', ph: '2022' },
  { k: 'anoModelo', label: 'Ano modelo', type: 'number', ph: '2023' },
  { k: 'cor', label: 'Cor', type: 'text', ph: 'Ex.: Prata' },
  { k: 'placa', label: 'Placa', type: 'text', ph: 'ABC1D23' },
  { k: 'quilometragem', label: 'Quilometragem', type: 'number', ph: '48000' },
  { k: 'estoqueDesde', label: 'No estoque desde', type: 'date', ph: '' },
]

export default function VeiculoForm({ veiculo: veiculoInicial, onSalvo, onCancelar }) {
  const [veiculo, setVeiculo] = useState(() => {
    if (veiculoInicial) {
      return {
        ...veiculoInicial,
        ano: veiculoInicial.ano ?? '',
        anoModelo: veiculoInicial.anoModelo ?? '',
        estoqueDesde:
          veiculoInicial.estoqueDesde ??
          (veiculoInicial.criadoEm ? veiculoInicial.criadoEm.slice(0, 10) : ''),
        fotos: [...(veiculoInicial.fotos || [])],
        pendencias: (veiculoInicial.pendencias || []).map((p) => ({ ...p })),
      }
    }
    return novoVeiculo()
  })

  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [processandoFotos, setProcessandoFotos] = useState(false)
  const [confirmarExclusao, setConfirmarExclusao] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const inputFoto = useRef(null)

  const ehEdicao = Boolean(veiculo.id)
  const titulo =
    veiculo.marca || veiculo.modelo ? `${veiculo.marca} ${veiculo.modelo}`.trim() : 'Novo veículo'
  const kicker = ehEdicao
    ? `${veiculo.placa || 'Sem placa'} · ${infoStatus(veiculo.status).rotulo}`
    : 'Novo cadastro'

  function atualizar(campo, valor) {
    setVeiculo((v) => ({ ...v, [campo]: valor }))
    setErro('')
  }

  async function aoEscolherFotos(evento) {
    const arquivos = Array.from(evento.target.files || [])
    if (arquivos.length === 0) return
    setProcessandoFotos(true)
    setErro('')
    try {
      const novas = []
      for (const arquivo of arquivos) {
        const blob = await redimensionarImagem(arquivo)
        novas.push(await enviarFoto(blob))
      }
      setVeiculo((v) => ({ ...v, fotos: [...v.fotos, ...novas] }))
    } catch (err) {
      setErro(err.message || 'Não foi possível enviar uma das imagens.')
    } finally {
      setProcessandoFotos(false)
      evento.target.value = ''
    }
  }

  function removerFoto(indice) {
    setVeiculo((v) => ({ ...v, fotos: v.fotos.filter((_, i) => i !== indice) }))
  }

  function prepararParaSalvar(v) {
    const num = (x) => (x === '' || x == null ? 0 : Number(x))
    return {
      ...v,
      ano: v.ano === '' || v.ano == null ? null : Number(v.ano),
      anoModelo: v.anoModelo === '' || v.anoModelo == null ? null : Number(v.anoModelo),
      estoqueDesde: v.estoqueDesde || null,
      quilometragem: num(v.quilometragem),
      precoCompra: num(v.precoCompra),
      precoVenda: num(v.precoVenda),
      pendencias: v.pendencias.map((p) => ({
        ...p,
        custoEstimado: num(p.custoEstimado),
        custoReal: num(p.custoReal),
      })),
    }
  }

  async function salvar() {
    setErro('')
    if (!veiculo.marca.trim() || !veiculo.modelo.trim()) {
      setErro('Preencha ao menos a marca e o modelo do veículo.')
      window.scrollTo(0, 0)
      return
    }
    setSalvando(true)
    try {
      await salvarVeiculo(prepararParaSalvar(veiculo))
      onSalvo()
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o veículo.')
      setSalvando(false)
      window.scrollTo(0, 0)
    }
  }

  async function excluir() {
    setExcluindo(true)
    try {
      await removerVeiculo(veiculo.id)
      onSalvo()
    } catch (err) {
      setErro(err.message || 'Não foi possível excluir o veículo.')
      setExcluindo(false)
      setConfirmarExclusao(false)
      window.scrollTo(0, 0)
    }
  }

  const custo = calcularCustoTotal(veiculo)
  const lucro = calcularLucroEstimado(veiculo)
  const margem = calcularMargemPercentual(veiculo)
  const resolvidas = custoPendenciasResolvidas(veiculo)
  const abertas = veiculo.pendencias.filter((p) => !p.resolvida).length

  const resumoLinhas = [
    { rotulo: 'Preço de compra', valor: formatarBRLCompacto(veiculo.precoCompra), borda: '1px solid var(--color-divider)', peso: 400 },
    { rotulo: '+ Pendências resolvidas', valor: formatarBRLCompacto(resolvidas), borda: '2px solid var(--color-text)', peso: 400 },
    { rotulo: 'Custo total', valor: formatarBRLCompacto(custo), borda: '1px solid var(--color-divider)', peso: 800 },
    { rotulo: 'Preço de venda', valor: formatarBRLCompacto(veiculo.precoVenda), borda: '0', peso: 800 },
  ]

  return (
    <section>
      {/* Topo */}
      <div style={{ padding: '28px 0 24px', borderBottom: '2px solid var(--color-divider)' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancelar}
          style={{ marginLeft: -4, marginBottom: 12 }}
        >
          <IconeVoltar size={16} />
          Voltar ao pátio
        </button>
        <div className="kicker" style={{ marginBottom: 6 }}>
          {kicker}
        </div>
        <h1 style={{ fontSize: 48, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 20px' }}>
          {titulo}
        </h1>
        <div className="grupo">
          {STATUS.map((s) => (
            <button
              key={s.valor}
              type="button"
              className={'grupo__opt' + (veiculo.status === s.valor ? ' ativo' : '')}
              style={{ padding: '9px 16px' }}
              onClick={() => atualizar('status', s.valor)}
            >
              {s.rotulo}
            </button>
          ))}
        </div>
      </div>

      {erro && (
        <div
          style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'var(--color-accent-100)',
            color: 'var(--color-accent-800)',
            fontWeight: 600,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <IconeAlerta size={16} />
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'flex-start', paddingTop: 8 }}>
        <div style={{ flex: '1 1 560px', minWidth: 0 }}>
          {/* 01 Dados */}
          <Secao numero="01" nome="Dados">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {CAMPOS.map((c) => (
                <div className="field" key={c.k}>
                  <label>{c.label}</label>
                  <input
                    className="input"
                    type={c.type}
                    value={veiculo[c.k]}
                    placeholder={c.ph}
                    min={c.type === 'number' ? '0' : undefined}
                    onChange={(e) =>
                      atualizar(c.k, c.k === 'placa' ? e.target.value.toUpperCase() : e.target.value)
                    }
                    style={{ minHeight: 40 }}
                  />
                </div>
              ))}
            </div>
          </Secao>

          {/* 02 Preços */}
          <Secao numero="02" nome="Preços">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { k: 'precoCompra', label: 'Preço de compra', ph: 'Quanto você pagou' },
                  { k: 'precoVenda', label: 'Preço de venda', ph: 'Quanto vai anunciar' },
                ].map((c) => (
                  <div className="field" key={c.k}>
                    <label>{c.label}</label>
                    <div className="moeda">
                      <span className="moeda__prefixo">R$</span>
                      <input
                        className="input"
                        type="number"
                        min="0"
                        value={veiculo[c.k]}
                        placeholder={c.ph}
                        onChange={(e) => atualizar(c.k, e.target.value)}
                        style={{ minHeight: 40 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={'caixa-check' + (veiculo.mostrarPrecoNoSite ? ' caixa-check--marcado' : '')}
                onClick={() => atualizar('mostrarPrecoNoSite', !veiculo.mostrarPrecoNoSite)}
              >
                <span className="caixa-check__box">
                  {veiculo.mostrarPrecoNoSite && <IconeCheck size={12} />}
                </span>
                Mostrar o preço na vitrine{' '}
                <span style={{ color: 'var(--color-neutral-700)' }}>
                  — desligado, aparece “Consulte”
                </span>
              </button>
            </div>
          </Secao>

          {/* 03 Fotos */}
          <Secao
            numero="03"
            nome="Fotos"
            meta={veiculo.fotos.length ? `${veiculo.fotos.length} ${veiculo.fotos.length === 1 ? 'foto' : 'fotos'}` : 'Sem fotos'}
          >
            <input
              ref={inputFoto}
              type="file"
              accept="image/*"
              multiple
              onChange={aoEscolherFotos}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {veiculo.fotos.map((foto, i) => (
                <div key={i} style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--color-neutral-300)', overflow: 'hidden' }}>
                  <img className="grayscale" src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <span
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      background: 'var(--color-text)',
                      color: 'var(--color-bg)',
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                    }}
                  >
                    {i === 0 ? 'Capa' : 'Foto ' + (i + 1)}
                  </span>
                  <button
                    type="button"
                    className="foto-remover"
                    title="Remover foto"
                    onClick={() => removerFoto(i)}
                  >
                    <IconeX size={14} />
                  </button>
                </div>
              ))}
              <button type="button" className="foto-add" onClick={() => inputFoto.current?.click()}>
                <IconeMais size={20} sw={2} />
                {processandoFotos ? 'Enviando…' : 'Adicionar fotos'}
              </button>
            </div>
          </Secao>

          {/* 04 Pendências */}
          <Secao
            numero="04"
            nome="Pendências"
            meta={veiculo.pendencias.length ? `${abertas} em aberto` : 'Nenhuma'}
            semBorda
          >
            <PendenciasEditor
              pendencias={veiculo.pendencias}
              aoAlterar={(lista) => atualizar('pendencias', lista)}
            />
          </Secao>
        </div>

        {/* Resumo financeiro */}
        <aside
          style={{
            flex: '1 1 300px',
            maxWidth: 380,
            position: 'sticky',
            top: 88,
            marginTop: 28,
            background: 'var(--color-surface)',
            borderTop: '4px solid var(--color-text)',
          }}
        >
          <div style={{ padding: '20px 20px 0', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
            Resumo financeiro
          </div>
          <div style={{ padding: '8px 20px 0' }}>
            {resumoLinhas.map((r) => (
              <div
                key={r.rotulo}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '10px 0',
                  borderBottom: r.borda,
                  fontSize: 14,
                  fontWeight: r.peso,
                }}
              >
                <span>{r.rotulo}</span>
                <span>{r.valor}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-neutral-700)' }}>
              Lucro estimado
            </div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                fontSize: 44,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: lucro < 0 ? 'var(--color-accent-700)' : 'var(--color-text)',
              }}
            >
              {(lucro > 0 ? '+' : '') + formatarBRLCompacto(lucro)}
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-neutral-700)' }}>
              {custo > 0 ? 'Margem de ' + pct(margem) + ' sobre o custo' : 'Informe o preço de compra'}
            </div>
          </div>
          <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={salvar}
              disabled={salvando}
              style={{ minHeight: 48, fontSize: 15, justifyContent: 'space-between' }}
            >
              {salvando ? 'Salvando…' : 'Salvar veículo'}
              <IconeCheck size={16} sw={2.5} />
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" className="btn btn-secondary" onClick={onCancelar}>
                Cancelar
              </button>
              {ehEdicao && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setConfirmarExclusao(true)}
                >
                  <IconeLixeira size={14} sw={2} />
                  Excluir
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {confirmarExclusao && (
        <div className="dialog-backdrop" onClick={() => setConfirmarExclusao(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-title">Excluir {titulo}?</div>
            <div className="dialog-body">
              O veículo, as fotos e as pendências serão removidos. Esta ação não pode ser desfeita.
            </div>
            <div className="dialog-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmarExclusao(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={excluir} disabled={excluindo}>
                {excluindo ? 'Excluindo…' : 'Excluir veículo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function Secao({ numero, nome, meta, semBorda, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px minmax(0, 1fr)',
        gap: 24,
        padding: '28px 0',
        borderBottom: semBorda ? 'none' : '2px solid var(--color-divider)',
      }}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, color: 'var(--color-accent)', lineHeight: 1 }}>
          {numero}
        </div>
        <div style={{ fontWeight: 600, marginTop: 6 }}>{nome}</div>
        {meta && <div style={{ fontSize: 12, color: 'var(--color-neutral-700)' }}>{meta}</div>}
      </div>
      <div style={{ minWidth: 0 }}>{children}</div>
    </div>
  )
}
