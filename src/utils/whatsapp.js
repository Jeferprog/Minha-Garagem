// Monta o link de contato do WhatsApp.

// Mantém só os números (tira espaços, parênteses, traços etc.).
export function apenasDigitos(texto) {
  return String(texto || '').replace(/\D/g, '')
}

// Monta a URL do WhatsApp (wa.me) com o número e a mensagem já preenchida.
// Devolve null quando não há número configurado.
// O número deve ter DDI + DDD + telefone (ex.: 5531999998888).
export function linkWhatsApp(numero, mensagem) {
  const n = apenasDigitos(numero)
  if (!n) return null
  return `https://wa.me/${n}?text=${encodeURIComponent(mensagem || '')}`
}
