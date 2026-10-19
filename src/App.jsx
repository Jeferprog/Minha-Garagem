import { useState } from 'react'
import VeiculoLista from './components/VeiculoLista.jsx'
import VeiculoForm from './components/VeiculoForm.jsx'
import Vitrine from './components/Vitrine.jsx'
import { IconeCarro, IconeMais } from './components/Icones.jsx'

// Componente principal. Controla qual tela está aberta e qual veículo
// está sendo editado. Trocar de tela é só mudar o valor de "tela".
export default function App() {
  const [tela, setTela] = useState('lista') // 'lista' | 'form' | 'vitrine'
  const [veiculoEditando, setVeiculoEditando] = useState(null)

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
              <p className="cabecalho__sub">Controle interno de veículos</p>
            </div>
          </div>

          <div className="cabecalho__acoes">
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
            </nav>
            <button type="button" className="botao botao--primario" onClick={abrirNovo}>
              <IconeMais size={18} />
              Novo veículo
            </button>
          </div>
        </div>
      </header>

      <main className="conteudo">
        <div className="conteudo__inner">
          {tela === 'lista' && (
            <VeiculoLista onNovo={abrirNovo} onEditar={abrirEdicao} />
          )}

          {tela === 'form' && (
            <VeiculoForm
              veiculo={veiculoEditando}
              onSalvo={voltarParaLista}
              onCancelar={voltarParaLista}
            />
          )}

          {tela === 'vitrine' && <Vitrine />}
        </div>
      </main>

      <footer className="rodape">
        Os dados ficam salvos neste navegador. Para uso em vários computadores,
        depois trocamos para um banco de dados online (Supabase).
      </footer>
    </div>
  )
}
