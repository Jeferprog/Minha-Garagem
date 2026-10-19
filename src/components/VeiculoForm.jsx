import { useState } from 'react'
import { salvarVeiculo } from '../data/repository.js'
import {
  STATUS,
  novoVeiculo,
  calcularCustoTotal,
  calcularLucroEstimado,
} from '../data/modelos.js'
import { formatarBRL, redimensionarImagem } from '../utils/formato.js'
import PendenciasEditor from './PendenciasEditor.jsx'

// Formulário de cadastro (veículo novo) e de edição (veículo existente).
export default function VeiculoForm({ veiculo: veiculoInicial, onSalvo, onCancelar }) {
  // Cópia local para edição. Não mexemos no objeto original da lista.
  const [veiculo, setVeiculo] = useState(() => {
    if (veiculoInicial) {
      return {
        ...veiculoInicial,
        // Veículos antigos podem não ter esses campos; usamos '' como padrão
        // para que os inputs continuem "controlados".
        ano: veiculoInicial.ano ?? '',
        anoModelo: veiculoInicial.anoModelo ?? '',
        fotos: [...(veiculoInicial.fotos || [])],
        pendencias: (veiculoInicial.pendencias || []).map((p) => ({ ...p })),
      }
    }
    return novoVeiculo()
  })

  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [processandoFotos, setProcessandoFotos] = useState(false)

  const ehEdicao = Boolean(veiculo.id)

  function atualizar(campo, valor) {
    setVeiculo((v) => ({ ...v, [campo]: valor }))
  }

  async function aoEscolherFotos(evento) {
    const arquivos = Array.from(evento.target.files || [])
    if (arquivos.length === 0) return

    setProcessandoFotos(true)
    setErro('')
    try {
      const novas = []
      for (const arquivo of arquivos) {
        novas.push(await redimensionarImagem(arquivo))
      }
      setVeiculo((v) => ({ ...v, fotos: [...v.fotos, ...novas] }))
    } catch {
      setErro('Não foi possível processar uma das imagens.')
    } finally {
      setProcessandoFotos(false)
      evento.target.value = '' // permite escolher o mesmo arquivo novamente
    }
  }

  function removerFoto(indice) {
    setVeiculo((v) => ({ ...v, fotos: v.fotos.filter((_, i) => i !== indice) }))
  }

  // Converte os campos de texto para números antes de salvar.
  function prepararParaSalvar(v) {
    const paraNumero = (x) => (x === '' || x == null ? 0 : Number(x))
    return {
      ...v,
      ano: v.ano === '' || v.ano == null ? null : Number(v.ano),
      anoModelo: v.anoModelo === '' || v.anoModelo == null ? null : Number(v.anoModelo),
      quilometragem: paraNumero(v.quilometragem),
      precoCompra: paraNumero(v.precoCompra),
      precoVenda: paraNumero(v.precoVenda),
      pendencias: v.pendencias.map((p) => ({
        ...p,
        custoEstimado: paraNumero(p.custoEstimado),
        custoReal: paraNumero(p.custoReal),
      })),
    }
  }

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')

    if (!veiculo.marca.trim() || !veiculo.modelo.trim()) {
      setErro('Preencha ao menos a marca e o modelo do veículo.')
      return
    }

    setSalvando(true)
    try {
      await salvarVeiculo(prepararParaSalvar(veiculo))
      onSalvo()
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar o veículo.')
      setSalvando(false)
    }
  }

  const custoTotal = calcularCustoTotal(veiculo)
  const lucro = calcularLucroEstimado(veiculo)

  return (
    <form className="form" onSubmit={salvar}>
      <div className="form__cabecalho">
        <h2>{ehEdicao ? 'Editar veículo' : 'Novo veículo'}</h2>
        <button type="button" className="botao botao--neutro" onClick={onCancelar}>
          Voltar
        </button>
      </div>

      {erro && <p className="aviso-erro">{erro}</p>}

      {/* --- Dados do veículo --- */}
      <fieldset className="form__secao">
        <legend>Dados do veículo</legend>
        <div className="form__grade">
          <div className="campo">
            <label>Marca *</label>
            <input
              type="text"
              value={veiculo.marca}
              onChange={(e) => atualizar('marca', e.target.value)}
              placeholder="Ex.: Volkswagen"
            />
          </div>
          <div className="campo">
            <label>Modelo *</label>
            <input
              type="text"
              value={veiculo.modelo}
              onChange={(e) => atualizar('modelo', e.target.value)}
              placeholder="Ex.: Gol 1.0"
            />
          </div>
          <div className="campo">
            <label>Ano fabricação</label>
            <input
              type="number"
              value={veiculo.ano}
              onChange={(e) => atualizar('ano', e.target.value)}
              placeholder="Ex.: 2022"
            />
          </div>
          <div className="campo">
            <label>Ano modelo</label>
            <input
              type="number"
              value={veiculo.anoModelo}
              onChange={(e) => atualizar('anoModelo', e.target.value)}
              placeholder="Ex.: 2023"
            />
          </div>
          <div className="campo">
            <label>Cor</label>
            <input
              type="text"
              value={veiculo.cor}
              onChange={(e) => atualizar('cor', e.target.value)}
              placeholder="Ex.: Prata"
            />
          </div>
          <div className="campo">
            <label>Placa</label>
            <input
              type="text"
              value={veiculo.placa}
              onChange={(e) => atualizar('placa', e.target.value.toUpperCase())}
              placeholder="Ex.: ABC1D23"
            />
          </div>
          <div className="campo">
            <label>Quilometragem</label>
            <input
              type="number"
              min="0"
              value={veiculo.quilometragem}
              onChange={(e) => atualizar('quilometragem', e.target.value)}
              placeholder="Ex.: 48000"
            />
          </div>
          <div className="campo">
            <label>Status</label>
            <select
              value={veiculo.status}
              onChange={(e) => atualizar('status', e.target.value)}
            >
              {STATUS.map((s) => (
                <option key={s.valor} value={s.valor}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      {/* --- Preços --- */}
      <fieldset className="form__secao">
        <legend>Preços</legend>
        <div className="form__grade">
          <div className="campo">
            <label>Preço de compra</label>
            <div className="campo-moeda">
              <span className="campo-moeda__prefixo">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={veiculo.precoCompra}
                onChange={(e) => atualizar('precoCompra', e.target.value)}
                placeholder="Quanto você pagou"
              />
            </div>
          </div>
          <div className="campo">
            <label>Preço de venda</label>
            <div className="campo-moeda">
              <span className="campo-moeda__prefixo">R$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={veiculo.precoVenda}
                onChange={(e) => atualizar('precoVenda', e.target.value)}
                placeholder="Quanto vai anunciar"
              />
            </div>
          </div>
        </div>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={veiculo.mostrarPrecoNoSite}
            onChange={(e) => atualizar('mostrarPrecoNoSite', e.target.checked)}
          />
          Mostrar o preço no site (se desmarcado, a vitrine exibirá "Consulte")
        </label>
      </fieldset>

      {/* --- Fotos --- */}
      <fieldset className="form__secao">
        <legend>Fotos</legend>
        <input type="file" accept="image/*" multiple onChange={aoEscolherFotos} />
        {processandoFotos && <p className="texto-suave">Processando fotos…</p>}

        {veiculo.fotos.length > 0 && (
          <div className="fotos-grade">
            {veiculo.fotos.map((foto, indice) => (
              <div key={indice} className="foto-item">
                <img src={foto} alt={`Foto ${indice + 1}`} />
                <button
                  type="button"
                  className="foto-item__remover"
                  title="Remover foto"
                  onClick={() => removerFoto(indice)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </fieldset>

      {/* --- Pendências / avarias --- */}
      <fieldset className="form__secao">
        <legend>Pendências e avarias</legend>
        <PendenciasEditor
          pendencias={veiculo.pendencias}
          aoAlterar={(novaLista) => atualizar('pendencias', novaLista)}
        />
      </fieldset>

      {/* --- Resumo de custos --- */}
      <div className="resumo-custos">
        <div className="resumo-custos__item">
          <span className="texto-suave">Custo total</span>
          <strong className="num">{formatarBRL(custoTotal)}</strong>
        </div>
        <div className="resumo-custos__item">
          <span className="texto-suave">Lucro estimado</span>
          <strong className={'num ' + (lucro < 0 ? 'valor-negativo' : 'valor-positivo')}>
            {formatarBRL(lucro)}
          </strong>
        </div>
      </div>

      {/* --- Ações --- */}
      <div className="form__acoes">
        <button type="button" className="botao botao--neutro" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" className="botao botao--primario" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
