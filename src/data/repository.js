/**
 * repository.js — O ÚNICO lugar do sistema que acessa os dados.
 * ---------------------------------------------------------------
 * Hoje os veículos são salvos no próprio navegador (localStorage).
 *
 * No futuro, para usar o Supabase, basta reescrever o INTERIOR das
 * funções abaixo, mantendo os mesmos nomes e o mesmo comportamento
 * (o que elas recebem e o que elas devolvem). Nenhuma tela precisará
 * ser alterada, porque as telas só conhecem estas funções.
 *
 * Todas as funções são assíncronas (retornam Promise) de propósito:
 * o Supabase trabalha de forma assíncrona (com "await"), então as
 * telas já estão preparadas para isso desde agora.
 *
 * Funções disponíveis:
 *   listarVeiculos()      -> Promise com a lista de veículos
 *   obterVeiculo(id)      -> Promise com um veículo (ou null)
 *   salvarVeiculo(veiculo)-> Promise com o veículo salvo (cria ou atualiza)
 *   removerVeiculo(id)    -> Promise (remove o veículo)
 */

import { gerarId } from '../utils/formato.js'

// Nomes das "gavetas" onde os dados ficam guardados no navegador.
const CHAVE = 'minha-garagem:veiculos'
const CHAVE_CONFIG = 'minha-garagem:config'

// --- Funções internas (uso apenas dentro deste arquivo) ---

function lerTudo() {
  try {
    const bruto = localStorage.getItem(CHAVE)
    return bruto ? JSON.parse(bruto) : []
  } catch (erro) {
    console.error('Erro ao ler os dados salvos:', erro)
    return []
  }
}

function gravarTudo(veiculos) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(veiculos))
  } catch (erro) {
    if (erro && erro.name === 'QuotaExceededError') {
      throw new Error(
        'O armazenamento do navegador está cheio. ' +
          'Isso costuma acontecer por causa das fotos. ' +
          'Tente usar menos fotos por veículo ou remover veículos antigos.',
      )
    }
    throw erro
  }
}

// --- Funções usadas pelas telas (a "interface" do repositório) ---

export async function listarVeiculos() {
  const veiculos = lerTudo()
  // Mais recentes primeiro.
  return veiculos.sort((a, b) =>
    (b.atualizadoEm || '').localeCompare(a.atualizadoEm || ''),
  )
}

export async function obterVeiculo(id) {
  const veiculos = lerTudo()
  return veiculos.find((v) => v.id === id) || null
}

export async function salvarVeiculo(veiculo) {
  const veiculos = lerTudo()
  const agora = new Date().toISOString()

  // Já tem id => é edição de um veículo existente.
  if (veiculo.id) {
    const indice = veiculos.findIndex((v) => v.id === veiculo.id)
    const atualizado = { ...veiculo, atualizadoEm: agora }
    if (indice >= 0) {
      veiculos[indice] = atualizado
    } else {
      veiculos.push(atualizado)
    }
    gravarTudo(veiculos)
    return atualizado
  }

  // Sem id => é um cadastro novo.
  const novo = {
    ...veiculo,
    id: gerarId(),
    criadoEm: agora,
    atualizadoEm: agora,
  }
  veiculos.push(novo)
  gravarTudo(veiculos)
  return novo
}

export async function removerVeiculo(id) {
  const veiculos = lerTudo().filter((v) => v.id !== id)
  gravarTudo(veiculos)
}

// --- Configurações do sistema (ex.: número de WhatsApp) ---
// Também passam pelo repositório para, no futuro, irem para o Supabase.

export async function obterConfig() {
  try {
    const bruto = localStorage.getItem(CHAVE_CONFIG)
    return bruto ? JSON.parse(bruto) : { whatsapp: '' }
  } catch (erro) {
    console.error('Erro ao ler as configurações:', erro)
    return { whatsapp: '' }
  }
}

export async function salvarConfig(config) {
  try {
    localStorage.setItem(CHAVE_CONFIG, JSON.stringify(config))
  } catch (erro) {
    console.error('Erro ao salvar as configurações:', erro)
    throw erro
  }
  return config
}
