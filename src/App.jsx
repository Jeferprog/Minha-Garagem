import { useEffect, useState } from 'react'
import VeiculoLista from './components/VeiculoLista.jsx'
import VeiculoForm from './components/VeiculoForm.jsx'
import Vitrine from './components/Vitrine.jsx'
import Login from './components/Login.jsx'
import Configuracoes from './components/Configuracoes.jsx'
import { IconeCarro, IconeMais } from './components/Icones.jsx'
import { entrar, sair, obterSessao, observarSessao } from './auth.js'

// Componente principal.
// - A VITRINE é pública (qualquer pessoa vê).
// - As demais telas (lista, cadastro/edição, configurações) são da
//   administração e exigem login (e-mail e senha) pelo Supabase.
export default function App() {
  const [sessao, setSessao] = useState(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [tela, setTela] = useState('vitrine') // 'vitrine' | 'lista' | 'form' | 'config'
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [telaLogin, setTelaLogin] = useState(false)

  const autenticado = !!sessao

  // Verifica se já existe alguém logado e fica de olho em mudanças de login.
  useEffect(() => {
    obterSessao().then((s) => {
      setSessao(s)
      setCarregandoSessao(false)
    })
    const parar = observarSessao((s) => setSessao(s))
    return parar
  }, [])

  async function fazerLogin(email, senha) {
    const novaSessao = await entrar(email, senha) // lança erro se falhar
    setSessao(novaSessao)
    setTelaLogin(false)
    setTela('lista')
  }

  async function sairAdmin() {
    await sair()
    setSessao(null)
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

  // Enquanto verifica se há login salvo, mostra um aviso curto.
  if (carregandoSessao) {
    return (
      <div className="login">
        <p className="texto-suave">Carregando…</p>
      </div>
    )
  }

  // Tela de login (quando o visitante clica em "Administração").
  if (!autenticado && telaLogin) {
    return <Login onEntrar={fazerLogin} onVoltar={() => setTelaLogin(false)} />
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
          ? 'Dados salvos online no Supabase — aparecem em qualquer dispositivo.'
          : 'Minha Garagem — revenda de veículos.'}
      </footer>
    </div>
  )
}
