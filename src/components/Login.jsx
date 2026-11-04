import { useState } from 'react'

// Tela de login da administração (mesmo sistema visual Modernist).
export default function Login({ onEntrar, onVoltar }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await onEntrar(email, senha)
    } catch (err) {
      setErro(err.message || 'Não foi possível entrar.')
      setEnviando(false)
    }
  }

  return (
    <div className="login">
      <form className="login__caixa" onSubmit={enviar}>
        <span className="marca__quadrado" style={{ width: 32, height: 32 }} aria-hidden="true"></span>
        <h1 style={{ fontSize: 28, letterSpacing: '-0.02em' }}>Administração</h1>
        <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>
          Entre com seu e-mail e senha de administrador.
        </p>

        <div className="field">
          <label>E-mail</label>
          <input
            className="input"
            type="email"
            value={email}
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value)
              setErro('')
            }}
            placeholder="voce@email.com"
            style={{ minHeight: 44 }}
          />
        </div>

        <div className="field">
          <label>Senha</label>
          <input
            className="input"
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro('')
            }}
            style={{ minHeight: 44 }}
          />
        </div>

        {erro && (
          <div style={{ padding: '10px 12px', background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', fontWeight: 600, fontSize: 14 }}>
            {erro}
          </div>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={enviando} style={{ minHeight: 48 }}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="btn btn-secondary btn-block" onClick={onVoltar}>
          Voltar para a vitrine
        </button>
      </form>
    </div>
  )
}
