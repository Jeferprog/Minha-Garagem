import { useEffect, useState } from 'react'
import VeiculoLista from './components/VeiculoLista.jsx'
import VeiculoForm from './components/VeiculoForm.jsx'
import Vitrine from './components/Vitrine.jsx'
import Login from './components/Login.jsx'
import Configuracoes from './components/Configuracoes.jsx'
import { IconeMais } from './components/Icones.jsx'
import { entrar, sair, obterSessao, observarSessao } from './auth.js'

// Componente principal.
// - A VITRINE é pública. As demais telas (Pátio, Ficha, Configurações) são
//   da administração e exigem login (e-mail e senha) pelo Supabase.
// - Telas internas: 'lista' (Pátio), 'form' (Ficha), 'vitrine', 'config'.
export default function App() {
  const [sessao, setSessao] = useState(null)
  const [carregandoSessao, setCarregandoSessao] = useState(true)
  const [tela, setTela] = useState('vitrine')
  const [veiculoEditando, setVeiculoEditando] = useState(null)
  const [telaLogin, setTelaLogin] = useState(false)

  const autenticado = !!sessao

  useEffect(() => {
    obterSessao().then((s) => {
      setSessao(s)
      setCarregandoSessao(false)
    })
    const parar = observarSessao((s) => setSessao(s))
    return parar
  }, [])

  async function fazerLogin(email, senha) {
    const novaSessao = await entrar(email, senha)
    setSessao(novaSessao)
    setTelaLogin(false)
    setTela('lista')
  }

  async function sairAdmin() {
    await sair()
    setSessao(null)
    setTela('vitrine')
  }

  function irPara(t) {
    setTela(t)
    window.scrollTo(0, 0)
  }
  function abrirNovo() {
    setVeiculoEditando(null)
    irPara('form')
  }
  function abrirEdicao(veiculo) {
    setVeiculoEditando(veiculo)
    irPara('form')
  }
  function voltarParaLista() {
    setVeiculoEditando(null)
    irPara('lista')
  }

  if (carregandoSessao) {
    return (
      <div className="login">
        <p className="text-muted">Carregando…</p>
      </div>
    )
  }

  if (!autenticado && telaLogin) {
    return <Login onEntrar={fazerLogin} onVoltar={() => setTelaLogin(false)} />
  }

  const mostrarVitrine = !autenticado || tela === 'vitrine'
  const navItens = [
    { rotulo: 'Pátio', alvo: 'lista', ativo: tela === 'lista' || tela === 'form' },
    { rotulo: 'Vitrine', alvo: 'vitrine', ativo: tela === 'vitrine' },
    { rotulo: 'Configurações', alvo: 'config', ativo: tela === 'config' },
  ]

  return (
    <div className="app">
      <header className="cabecalho">
        <div className="cabecalho__inner">
          <button
            type="button"
            className="marca"
            onClick={() => irPara(autenticado ? 'lista' : 'vitrine')}
          >
            <span className="marca__quadrado" aria-hidden="true"></span>
            <span className="marca__texto">
              <span className="marca__nome">Minha Garagem</span>
              <span className="marca__sub">
                {tela === 'vitrine' ? 'Veículos à venda' : 'Controle interno'}
              </span>
            </span>
          </button>

          {autenticado && (
            <nav className="cab-nav">
              {navItens.map((n) => (
                <button
                  key={n.alvo}
                  type="button"
                  className={'cab-nav__item' + (n.ativo ? ' ativo' : '')}
                  onClick={() => irPara(n.alvo)}
                >
                  {n.rotulo}
                </button>
              ))}
            </nav>
          )}

          <div className="cabecalho__acoes">
            {autenticado ? (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={abrirNovo}
                  style={{ minHeight: 40, paddingInline: '16px 20px' }}
                >
                  <IconeMais size={16} />
                  Novo veículo
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={sairAdmin}
                  style={{ minHeight: 40 }}
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setTelaLogin(true)}
                style={{ minHeight: 40 }}
              >
                Administração
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="conteudo">
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
      </main>

      <footer className="rodape">
        <div className="rodape__inner">
          <span>Minha Garagem — revenda de veículos</span>
          <span>Dados salvos online, em qualquer dispositivo</span>
        </div>
      </footer>
    </div>
  )
}
