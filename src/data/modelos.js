// Define "o que é" um veículo e uma pendência no sistema, além das
// regras simples de negócio (lista de status e cálculo de custo).
// Centralizar isso aqui evita repetir essas definições pelas telas.

import { gerarId } from '../utils/formato.js'

// Status possíveis de um veículo. "valor" é o que fica salvo;
// "rotulo" é o texto mostrado na tela; "cor" é usada no selo (badge).
export const STATUS = [
  { valor: 'em_preparacao', rotulo: 'Em preparação', cor: '#b45309' },
  { valor: 'a_venda', rotulo: 'À venda', cor: '#15803d' },
  { valor: 'reservado', rotulo: 'Reservado', cor: '#1d4ed8' },
  { valor: 'vendido', rotulo: 'Vendido', cor: '#64748b' },
]

// Dado um status salvo, devolve o rótulo e a cor para exibição.
export function infoStatus(valor) {
  return STATUS.find((s) => s.valor === valor) || STATUS[0]
}

// Texto do ano para exibição: "2022/2023" (fabricação/modelo), ou só um
// deles quando o outro não foi informado.
export function formatarAno(veiculo) {
  const temFab = veiculo.ano !== '' && veiculo.ano != null
  const temMod = veiculo.anoModelo !== '' && veiculo.anoModelo != null
  if (temFab && temMod) return `${veiculo.ano}/${veiculo.anoModelo}`
  if (temFab) return String(veiculo.ano)
  if (temMod) return String(veiculo.anoModelo)
  return ''
}

// Data de hoje no formato aaaa-mm-dd (padrão do campo "No estoque desde").
export function hojeISO() {
  const d = new Date()
  const ano = d.getFullYear()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

// Cria um veículo "em branco" para o formulário de cadastro.
export function novoVeiculo() {
  return {
    id: null,
    marca: '',
    modelo: '',
    ano: '',
    anoModelo: '',
    cor: '',
    placa: '',
    quilometragem: '',
    estoqueDesde: hojeISO(),
    precoCompra: '',
    precoVenda: '',
    mostrarPrecoNoSite: true,
    status: 'em_preparacao',
    fotos: [],
    pendencias: [],
  }
}

// Cria uma pendência/avaria "em branco" para a lista do formulário.
export function novaPendencia() {
  return {
    id: gerarId(),
    descricao: '',
    custoEstimado: '',
    custoReal: '',
    resolvida: false,
    mostrarNoSite: false,
  }
}

// Soma o custo real apenas das pendências já RESOLVIDAS.
export function custoPendenciasResolvidas(veiculo) {
  return (veiculo.pendencias || [])
    .filter((p) => p.resolvida)
    .reduce((total, p) => total + (Number(p.custoReal) || 0), 0)
}

// Custo total do carro = preço de compra + custo real das pendências resolvidas.
export function calcularCustoTotal(veiculo) {
  const compra = Number(veiculo.precoCompra) || 0
  return compra + custoPendenciasResolvidas(veiculo)
}

// Lucro estimado = preço de venda - custo total. Pode ser negativo.
export function calcularLucroEstimado(veiculo) {
  const venda = Number(veiculo.precoVenda) || 0
  return venda - calcularCustoTotal(veiculo)
}

// Margem em porcentagem = lucro / custo total * 100. Zero se não houver custo.
export function calcularMargemPercentual(veiculo) {
  const custo = calcularCustoTotal(veiculo)
  if (custo <= 0) return 0
  return (calcularLucroEstimado(veiculo) / custo) * 100
}

// Quantos dias o veículo está em estoque, contando a partir da data
// "No estoque desde" (estoqueDesde). Devolve null se não houver data.
export function diasEmEstoque(veiculo) {
  // Usa a data "No estoque desde"; se não houver, cai para a data de cadastro.
  const base = veiculo.estoqueDesde || veiculo.criadoEm
  if (!base) return null

  let inicio
  if (typeof base === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(base)) {
    // Data simples (aaaa-mm-dd): interpreta como meia-noite no horário local.
    const [a, m, d] = base.split('-').map(Number)
    inicio = new Date(a, m - 1, d)
  } else {
    // Data/hora completa (ex.: criadoEm em ISO).
    inicio = new Date(base)
  }

  if (isNaN(inicio.getTime())) return null
  const ms = Date.now() - inicio.getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

// Texto amigável do tempo em estoque. Ex.: "Cadastrado hoje", "há 1 dia",
// "há 12 dias em estoque".
export function textoEmEstoque(veiculo) {
  const dias = diasEmEstoque(veiculo)
  if (dias == null) return ''
  if (dias === 0) return 'Cadastrado hoje'
  if (dias === 1) return 'Há 1 dia em estoque'
  return `Há ${dias} dias em estoque`
}

// Resumo geral do inventário, usado na faixa de indicadores (KPIs).
// Considera "em estoque" tudo que ainda não foi vendido.
export function resumoInventario(veiculos) {
  const lista = veiculos || []
  const emEstoque = lista.filter((v) => v.status !== 'vendido')
  const vendidos = lista.filter((v) => v.status === 'vendido')

  const custoEstoque = emEstoque.reduce((t, v) => t + calcularCustoTotal(v), 0)
  const vendaEstoque = emEstoque.reduce((t, v) => t + (Number(v.precoVenda) || 0), 0)
  const lucroEstoque = vendaEstoque - custoEstoque
  const margem = custoEstoque > 0 ? (lucroEstoque / custoEstoque) * 100 : 0

  return {
    total: lista.length,
    emEstoque: emEstoque.length,
    vendidos: vendidos.length,
    custoEstoque,
    vendaEstoque,
    lucroEstoque,
    margem,
  }
}
