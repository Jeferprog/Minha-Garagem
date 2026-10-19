import { useState } from 'react'
import { verificarSenha } from '../auth.js'
import { IconeCarro } from './Icones.jsx'

// Tela de login da área de administração (acessada pelo botão
// "Administração" na vitrine pública).
export default function Login({ onEntrar, onVoltar }) {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  function enviar(evento) {
    evento.preventDefault()
    if (verificarSenha(senha)) {
      onEntrar()
    } else {
      setErro('Senha incorreta. Tente novamente.')
    }
  }

  return (
    <div className="login">
      <form className="login__caixa" onSubmit={enviar}>
        <span className="cabecalho__logo-box login__logo">
          <IconeCarro size={28} />
        </span>
        <h1>Administração</h1>
        <p className="texto-suave">Área restrita ao administrador.</p>

        <div className="campo">
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            autoFocus
            onChange={(e) => {
              setSenha(e.target.value)
              setErro('')
            }}
          />
        </div>

        {erro && <p className="aviso-erro">{erro}</p>}

        <button type="submit" className="botao botao--primario">
          Entrar
        </button>
        <button type="button" className="botao botao--neutro" onClick={onVoltar}>
          Voltar para a vitrine
        </button>
      </form>
    </div>
  )
}
