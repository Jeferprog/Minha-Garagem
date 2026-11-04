// Ícones em SVG (estilo Lucide), desenhados aqui para não depender de
// biblioteca externa. Todos usam "currentColor" (a cor vem do CSS).
// "size" muda o tamanho; "sw" muda a espessura do traço.

function Svg({ size = 20, sw = 2, children }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconeMais({ size, sw = 2.5 }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </Svg>
  )
}

export function IconeBusca({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </Svg>
  )
}

export function IconeCarro({ size, sw = 1.75 }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </Svg>
  )
}

export function IconeSeta({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Svg>
  )
}

export function IconeVoltar({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </Svg>
  )
}

export function IconeTabela({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </Svg>
  )
}

export function IconeGrade({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </Svg>
  )
}

export function IconeAlerta({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </Svg>
  )
}

export function IconeCheck({ size, sw = 3.5 }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M20 6 9 17l-5-5" />
    </Svg>
  )
}

export function IconeX({ size, sw = 2.5 }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </Svg>
  )
}

export function IconeLixeira({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </Svg>
  )
}

export function IconeOlho({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  )
}

export function IconeWhatsapp({ size, sw }) {
  return (
    <Svg size={size} sw={sw}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </Svg>
  )
}
