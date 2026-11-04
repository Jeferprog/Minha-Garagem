// Cores das tags de status (design Modernist). Devolvem objetos de estilo
// para uso inline, já que as cores vêm das variáveis do tema.

// Tag usada na tabela/lista (com borda).
export function tagStatus(status) {
  const mapa = {
    a_venda: {
      background: 'var(--color-accent)',
      color: 'var(--color-bg)',
      border: '1px solid var(--color-accent)',
    },
    reservado: {
      background: 'transparent',
      color: 'var(--color-accent-700)',
      border: '1px solid var(--color-accent)',
    },
    em_preparacao: {
      background: 'var(--color-neutral-200)',
      color: 'var(--color-neutral-800)',
      border: '1px solid var(--color-neutral-200)',
    },
    vendido: {
      background: 'transparent',
      color: 'var(--color-neutral-600)',
      border: '1px solid var(--color-divider)',
    },
  }
  return mapa[status] || mapa.em_preparacao
}

// Tag flutuante sobre a foto: "à venda" em vermelho, o resto em claro.
export function tagFlutuante(status) {
  return status === 'a_venda'
    ? { background: 'var(--color-accent)', color: 'var(--color-bg)' }
    : { background: 'var(--color-bg)', color: 'var(--color-text)' }
}
