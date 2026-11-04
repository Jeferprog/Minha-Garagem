import { useEffect, useState } from 'react'
import { obterConfig, salvarConfig } from '../data/repository.js'

// Tela de configurações: número de WhatsApp da vitrine.
export default function Configuracoes() {
  const [whatsapp, setWhatsapp] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [salvo, setSalvo] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    obterConfig()
      .then((c) => setWhatsapp(c.whatsapp || ''))
      .catch((e) => setErro(e.message || 'Não foi possível carregar as configurações.'))
      .finally(() => setCarregando(false))
  }, [])

  async function salvar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvo(false)
    try {
      await salvarConfig({ whatsapp: whatsapp.trim() })
      setSalvo(true)
    } catch (err) {
      setErro(err.message || 'Não foi possível salvar.')
    }
  }

  if (carregando) {
    return (
      <p className="text-muted" style={{ paddingTop: 24 }}>
        Carregando…
      </p>
    )
  }

  return (
    <section style={{ maxWidth: 760 }}>
      <div style={{ padding: '40px 0 24px', borderBottom: '2px solid var(--color-divider)' }}>
        <div className="kicker">Administração</div>
        <h1 className="titulo-tela">Configurações</h1>
      </div>

      <form onSubmit={salvar}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '120px minmax(0, 1fr)',
            gap: 24,
            padding: '28px 0',
            borderBottom: '2px solid var(--color-divider)',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 28, color: 'var(--color-accent)', lineHeight: 1 }}>
              01
            </div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>WhatsApp</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="field">
              <label>Número que recebe os contatos da vitrine</label>
              <input
                className="input"
                type="tel"
                value={whatsapp}
                onChange={(e) => {
                  setWhatsapp(e.target.value)
                  setSalvo(false)
                }}
                placeholder="Ex.: 5531999998888"
                style={{ minHeight: 44, fontSize: 18, letterSpacing: '0.04em', maxWidth: 320 }}
              />
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-neutral-700)', margin: 0, maxWidth: 520 }}>
              DDI + DDD + número, só algarismos. Celular (11) 98888-7777 fica{' '}
              <strong style={{ color: 'var(--color-text)' }}>5511988887777</strong>.
            </p>
          </div>
        </div>

        {erro && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--color-accent-100)', color: 'var(--color-accent-800)', fontWeight: 600 }}>
            {erro}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 24 }}>
          <button type="submit" className="btn btn-primary" style={{ minHeight: 44, paddingInline: '20px 28px' }}>
            Salvar
          </button>
          {salvo && (
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent-700)' }}>
              Configurações salvas
            </span>
          )}
        </div>
      </form>
    </section>
  )
}
