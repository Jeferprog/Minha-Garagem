import { useState } from 'react'
import { IconeCarro } from './Icones.jsx'

// Tela de login da administração (acessada pelo botão "Administração").
// Recebe "onEntrar(email, senha)" que faz o login e lança erro se falhar.
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
        <span className="cabecalho__logo-box login__logo">
          <IconeCarro size={28} />
        </span>
        <h1>Administração</h1>
        <p className="texto-suave">Entre com seu e-mail e senha de administrador.</p>

        <div className="campo">
          <label>E-mail</label>
          <input
            type="email"
            value={email}
            autoFocus
            onChange={(e) => {
              setEmail(e.target.value)
              setErro('')
            }}
            placeholder="voce@email.com"
          />
        </div>

        <div className="campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value)
              setErro('')
            }}
          />
        </div>

        {erro && <p className="aviso-erro">{erro}</p>}

        <button type="submit" className="botao botao--primario" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
        <button type="button" className="botao botao--neutro" onClick={onVoltar}>
          Voltar para a vitrine
        </button>
      </form>
    </div>
  )
}
