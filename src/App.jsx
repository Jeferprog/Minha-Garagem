import { useState } from 'react'
import VeiculoLista from './components/VeiculoLista.jsx'
import VeiculoForm from './components/VeiculoForm.jsx'
import Vitrine from './components/Vitrine.jsx'
import Login from './components/Login.jsx'
import Configuracoes from './components/Configuracoes.jsx'
import { IconeCarro, IconeMais } from './components/Icones.jsx'
import { estaAutenticado, autenticar, sair } from './auth.js'

// Componente principal.
// - A VITRINE é pública (qualquer pessoa vê).
// - As demais telas (lista de veículos, cadastro/edição) são da
//   administração e exigem senha.
export default function App() {
  const [autenticado, setAutenticado] = useState(() => estaAutenticado())
  const [tela, setTela] = useState('vitrine') // 'vitrine' | 'lista' | 'form'
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [telaLogin, setTelaLogin] = useState(false)

  function entrar() {
    autenticar()
    setAutenticado(true)
    setTelaLogin(false)
    setTela('lista')
  }

  function sairAdmin() {
    sair()
    setAutenticado(false)
    setTela('vitrine')
  }

  function abrirNovo() {
    setVeiculoEditando(null)
    setTela('form')
  }

  function abrirEdicao(veiculo) {
    setVeiculoEditando(veiculo)
    setTela('form')
  }

  function voltarParaLista() {
    setVeiculoEditando(null)
    setTela('lista')
  }

  // Tela de login (quando o visitante clica em "Administração").
  if (!autenticado && telaLogin) {
    return <Login onEntrar={entrar} onVoltar={() => setTelaLogin(false)} />
  }

  // Mostra a vitrine quando não está logado, ou quando o admin escolhe a aba.
  const mostrarVitrine = !autenticado || tela === 'vitrine'

  return (
    <div className="app">
      <header className="cabecalho">
        <div className="cabecalho__inner">
          <div className="cabecalho__marca">
            <span className="cabecalho__logo-box">
              <IconeCarro size={24} />
            </span>
            <div>
              <h1 className="cabecalho__titulo">Minha Garagem</h1>
              <p className="cabecalho__sub">
                {autenticado ? 'Controle interno de veículos' : 'Veículos à venda'}
              </p>
            </div>
          </div>

          <div className="cabecalho__acoes">
            {autenticado ? (
              <>
                <nav className="nav">
                  <button
                    type="button"
                    className={'nav__link' + (tela === 'lista' ? ' ativo' : '')}
                    onClick={voltarParaLista}
                  >
                    Veículos
                  </button>
                  <button
                    type="button"
                    className={'nav__link' + (tela === 'vitrine' ? ' ativo' : '')}
                    onClick={() => setTela('vitrine')}
                  >
                    Vitrine
                  </button>
                  <button
                    type="button"
                    className={'nav__link' + (tela === 'config' ? ' ativo' : '')}
                    onClick={() => setTela('config')}
                  >
                    Configurações
                  </button>
                </nav>
                <button type="button" className="botao botao--primario" onClick={abrirNovo}>
                  <IconeMais size={18} />
                  Novo veículo
                </button>
                <button type="button" className="botao botao--neutro" onClick={sairAdmin}>
                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                className="botao botao--neutro"
                onClick={() => setTelaLogin(true)}
              >
                Administração
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="conteudo">
        <div className="conteudo__inner">
          {mostrarVitrine && <Vitrine admin={autenticado} />}
          {autenticado && tela === 'lista' && (
            <VeiculoLista onNovo={abrirNovo} onEditar={abrirEdicao} />
          )}
          {autenticado && tela === 'form' && (
            <VeiculoForm
              veiculo={veiculoEditando}
              onSalvo={voltarParaLista}
              onCancelar={voltarParaLista}
            />
          )}
          {autenticado && tela === 'config' && <Configuracoes />}
        </div>
      </main>

      <footer className="rodape">
        {autenticado
          ? 'Os dados ficam salvos neste navegador. Para uso em vários computadores, depois trocamos para um banco de dados online (Supabase).'
          : 'Minha Garagem — revenda de veículos.'}
      </footer>
    </div>
  )
}
