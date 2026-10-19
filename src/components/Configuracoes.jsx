import { useEffect, useState } from 'react'
import { obterConfig, salvarConfig } from '../data/repository.js'

// Tela de configurações da administração. Por enquanto, o número de
// WhatsApp usado pelo botão de contato da vitrine.
export default function Configuracoes() {
  const [whatsapp, setWhatsapp] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    obterConfig().then((c) => {
      setWhatsapp(c.whatsapp || '')
      setCarregando(false)
    })
  }, [])

  async function salvar(evento) {
    evento.preventDefault()
    await salvarConfig({ whatsapp: whatsapp.trim() })
    setSalvo(true)
  }

  if (carregando) return <p className="texto-suave">Carregando…</p>

  return (
    <form className="form" onSubmit={salvar}>
      <div className="form__cabecalho">
        <h2>Configurações</h2>
      </div>

      <fieldset className="form__secao">
        <legend>Contato (WhatsApp)</legend>
        <div className="campo">
          <label>Número do WhatsApp</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => {
              setWhatsapp(e.target.value)
              setSalvo(false)
            }}
            placeholder="Ex.: 5531999998888"
          />
          <p className="campo__ajuda">
            Use DDI + DDD + número, só os algarismos. Para o Brasil, comece com{' '}
            <strong>55</strong> e o DDD. Ex.: celular (11) 98888-7777 fica{' '}
            <strong>5511988887777</strong>. É o número que recebe as mensagens
            do botão "Falar no WhatsApp" da vitrine.
          </p>
        </div>
      </fieldset>

      <div className="form__acoes">
        {salvo && <span className="texto-salvo">✓ Configurações salvas</span>}
        <button type="submit" className="botao botao--primario">
          Salvar
        </button>
      </div>
    </form>
  )
}
