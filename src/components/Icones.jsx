// Ícones em SVG desenhados aqui mesmo, sem biblioteca externa.
// Todos usam "currentColor", então a cor vem do CSS (a propriedade color).
// Para trocar o tamanho, passe a prop "size" (ex.: <IconeBusca size={18} />).

function Svg({ size = 20, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconeCarro({ size }) {
  return (
    <Svg size={size}>
      <path d="M3 13l1.8-5A2.5 2.5 0 0 1 7.2 6.3h9.6A2.5 2.5 0 0 1 19.2 8L21 13" />
      <path d="M3 13h18v4a1 1 0 0 1-1 1h-2v-1.2A1.2 1.2 0 0 0 16.8 15.6H7.2A1.2 1.2 0 0 0 6 16.8V18H4a1 1 0 0 1-1-1v-4z" />
      <circle cx="7.5" cy="16.5" r="1.1" />
      <circle cx="16.5" cy="16.5" r="1.1" />
    </Svg>
  )
}

export function IconeBusca({ size }) {
  return (
    <Svg size={size}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  )
}

export function IconeMais({ size }) {
  return (
    <Svg size={size}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  )
}

export function IconeEditar({ size }) {
  return (
    <Svg size={size}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </Svg>
  )
}

export function IconeLixeira({ size }) {
  return (
    <Svg size={size}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  )
}

export function IconeAlerta({ size }) {
  return (
    <Svg size={size}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  )
}

export function IconeCarteira({ size }) {
  return (
    <Svg size={size}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </Svg>
  )
}

export function IconeEtiqueta({ size }) {
  return (
    <Svg size={size}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </Svg>
  )
}

export function IconeTendencia({ size }) {
  return (
    <Svg size={size}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Svg>
  )
}
