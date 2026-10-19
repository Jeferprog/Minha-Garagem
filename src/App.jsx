import { useState } from 'react'
import VeiculoLista from './components/VeiculoLista.jsx'
import VeiculoForm from './components/VeiculoForm.jsx'
import Vitrine from './components/Vitrine.jsx'

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
        <div className="cabecalho__marca">
          <span className="cabecalho__logo" aria-hidden="true">
            🚗
          </span>
          <div>
            <h1>Minha Garagem</h1>
            <p>Controle interno de veículos</p>
          </div>
        </div>

        <nav className="cabecalho__nav">
          <button
            type="button"
            className={'botao botao--neutro' + (tela === 'lista' ? ' ativo' : '')}
            onClick={voltarParaLista}
          >
            Veículos
          </button>
          <button
            type="button"
            className={'botao botao--neutro' + (tela === 'vitrine' ? ' ativo' : '')}
            onClick={() => setTela('vitrine')}
          >
            Vitrine (prévia)
          </button>
          <button type="button" className="botao botao--primario" onClick={abrirNovo}>
            + Novo veículo
          </button>
        </nav>
      </header>

      <main className="conteudo">
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
      </main>

      <footer className="rodape">
        Os dados ficam salvos neste navegador. Para uso em vários
        computadores, depois trocamos para um banco de dados online (Supabase).
      </footer>
    </div>
  )
}
