// Login de administrador usando o Supabase (login de verdade, com
// e-mail e senha). A vitrine continua pública; só o administrador
// logado consegue cadastrar/editar/excluir veículos.

import { supabase } from './supabase.js'

// Entra com e-mail e senha. Devolve a sessão ou lança erro.
export async function entrar(email, senha) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: senha,
  })
  if (error) {
    throw new Error('E-mail ou senha incorretos.')
  }
  return data.session
}

export async function sair() {
  await supabase.auth.signOut()
}

// Sessão atual (ou null se ninguém está logado).
export async function obterSessao() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Chama "callback(sessao)" sempre que o login mudar (entrar/sair).
// Devolve uma função para parar de observar.
export function observarSessao(callback) {
  const { data } = supabase.auth.onAuthStateChange((_evento, sessao) => {
    callback(sessao)
  })
  return () => data.subscription.unsubscribe()
}
