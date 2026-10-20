/**
 * repository.js — O ÚNICO lugar do sistema que acessa os dados.
 * ---------------------------------------------------------------
 * Agora os dados ficam no Supabase (banco de dados online), então
 * aparecem em qualquer dispositivo e a vitrine é realmente pública.
 *
 * As telas continuam usando as MESMAS funções de antes
 * (listarVeiculos, obterVeiculo, salvarVeiculo, removerVeiculo,
 * obterConfig, salvarConfig) — por isso nenhuma tela precisou mudar.
 *
 * As colunas do banco usam os mesmos nomes dos campos do sistema
 * (marca, modelo, anoModelo, precoVenda, fotos, pendencias...),
 * então os dados vão e voltam sem precisar de "tradução".
 */

import { supabase } from '../supabase.js'
import { gerarId } from '../utils/formato.js'

// Transforma um erro do Supabase numa mensagem amigável, incluindo o
// motivo técnico real (ajuda muito a descobrir problemas de configuração).
function erroAmigavel(erro, acao) {
  console.error(`Erro ao ${acao}:`, erro)
  const detalhe = (erro && (erro.message || erro.hint || erro.details)) || ''
  return new Error(
    `Não foi possível ${acao}.` +
      (detalhe ? ` Motivo: ${detalhe}.` : '') +
      ' (Confira sua conexão e a configuração do Supabase.)',
  )
}

// --- Veículos ---

export async function listarVeiculos() {
  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .order('atualizadoEm', { ascending: false })
  if (error) throw erroAmigavel(error, 'carregar os veículos')
  return data || []
}

export async function obterVeiculo(id) {
  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw erroAmigavel(error, 'carregar o veículo')
  return data || null
}

export async function salvarVeiculo(veiculo) {
  const agora = new Date().toISOString()
  const registro = { ...veiculo, atualizadoEm: agora }

  // Sem id => é um cadastro novo.
  if (!registro.id) {
    registro.id = gerarId()
    registro.criadoEm = agora
  }

  const { data, error } = await supabase
    .from('veiculos')
    .upsert(registro)
    .select()
    .single()
  if (error) throw erroAmigavel(error, 'salvar o veículo')
  return data
}

export async function removerVeiculo(id) {
  const { error } = await supabase.from('veiculos').delete().eq('id', id)
  if (error) throw erroAmigavel(error, 'excluir o veículo')
}

// --- Configurações (ex.: número de WhatsApp) ---
// Guardadas numa tabela de uma linha só (id = 1).

export async function obterConfig() {
  const { data, error } = await supabase
    .from('config')
    .select('*')
    .eq('id', 1)
    .maybeSingle()
  if (error) throw erroAmigavel(error, 'carregar as configurações')
  return data || { whatsapp: '' }
}

export async function salvarConfig(config) {
  const { data, error } = await supabase
    .from('config')
    .upsert({ id: 1, ...config })
    .select()
    .single()
  if (error) throw erroAmigavel(error, 'salvar as configurações')
  return data
}
