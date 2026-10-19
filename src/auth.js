// Controle de acesso simples ("trava leve") da área de administração.
//
// IMPORTANTE: como o site é estático (GitHub Pages), esta senha é apenas
// uma proteção LEVE — suficiente para impedir o acesso casual de quem abrir
// a vitrine, mas NÃO é segurança forte (alguém com conhecimento técnico
// conseguiria contornar). O login de verdade virá com o Supabase.
//
// Para TROCAR A SENHA: altere o texto entre aspas em SENHA_ADMIN abaixo e
// publique o site novamente (ou peça para o Claude trocar).
export const SENHA_ADMIN = 'garagem2024'

// Enquanto a aba do navegador estiver aberta, o administrador continua
// logado. Ao fechar a aba, é preciso entrar com a senha de novo.
const CHAVE = 'minha-garagem:admin'

export function verificarSenha(senha) {
  return senha === SENHA_ADMIN
}

export function estaAutenticado() {
  try {
    return sessionStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

export function autenticar() {
  try {
    sessionStorage.setItem(CHAVE, '1')
  } catch {
    /* ignora navegadores que bloqueiam o armazenamento */
  }
}

export function sair() {
  try {
    sessionStorage.removeItem(CHAVE)
  } catch {
    /* ignora */
  }
}
