import { useEffect, useState } from 'react'
import { listarVeiculos, obterConfig } from '../data/repository.js'
import { infoStatus, formatarAno } from '../data/modelos.js'
import { formatarBRL, formatarNumero } from '../utils/formato.js'
import { linkWhatsApp } from '../utils/whatsapp.js'
import { VEICULOS_EXEMPLO } from '../data/exemplos.js'
import GaleriaFotos from './GaleriaFotos.jsx'
import { IconeWhatsapp } from './Icones.jsx'

// Vitrine pública. Mostra os veículos "à venda" ou "reservado".
// Quando não há nenhum, exibe veículos de exemplo (ilustração) para dar
// uma ideia de como a vitrine fica. A prop "admin" controla o aviso de
// prévia (só aparece para o administrador).
export default function Vitrine({ admin = false }) {
  const [veiculos, setVeiculos] = useState([])
  const [whatsapp, setWhatsapp] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    Promise.all([listarVeiculos(), obterConfig()])
      .then(([lista, config]) => {
        setVeiculos(lista)
        setWhatsapp(config.whatsapp || '')
      })
      .catch((e) => setErro(e.message || 'Não foi possível carregar a vitrine.'))
      .finally(() => setCarregando(false))
  }, [])

  const visiveis = veiculos.filter(
    (v) => v.status === 'a_venda' || v.status === 'reservado',
  )
  const usandoExemplos = !carregando && !erro && visiveis.length === 0
  const paraMostrar = usandoExemplos ? VEICULOS_EXEMPLO : visiveis

  return (
    <section className="vitrine">
      {admin && (
        <div className="vitrine__aviso">
          👁️ Prévia da vitrine. É assim que os veículos apareceriam no site
          público. Aparecem apenas os que estão <strong>à venda</strong> ou{' '}
          <strong>reservados</strong>.
        </div>
      )}

      {carregando && <p className="texto-suave">Carregando…</p>}
      {erro && <p className="aviso-erro">{erro}</p>}

      {usandoExemplos && (
        <div className="vitrine__exemplos">
          🚗 Veículos de <strong>exemplo</strong> (ilustração), só para mostrar
          como a vitrine fica. Eles somem assim que você cadastrar veículos
          reais com status <strong>à venda</strong> ou <strong>reservado</strong>.
        </div>
      )}

      <div className="grade-cards">
        {paraMostrar.map((veiculo) => {
          const status = infoStatus(veiculo.status)
          const pendenciasVisiveis = (veiculo.pendencias || []).filter(
            (p) => p.mostrarNoSite,
          )

          const anoTxt = formatarAno(veiculo)
          const detalhes = [
            anoTxt,
            veiculo.cor,
            veiculo.quilometragem !== '' && veiculo.quilometragem != null
              ? `${formatarNumero(veiculo.quilometragem)} km`
              : null,
          ]
            .filter(Boolean)
            .join(' • ')

          const mensagem =
            `Olá! Tenho interesse no ${veiculo.marca} ${veiculo.modelo}` +
            `${anoTxt ? ` (${anoTxt})` : ''}. Vi no site de vocês.`
          const urlWhatsApp = linkWhatsApp(whatsapp, mensagem)

          return (
            <article key={veiculo.id} className="card">
              <GaleriaFotos
                fotos={veiculo.fotos}
                alt={`${veiculo.marca} ${veiculo.modelo}`}
              >
                <span className={`badge badge--flutuante badge--${veiculo.status}`}>
                  <span className="badge__ponto"></span>
                  {status.rotulo}
                </span>
              </GaleriaFotos>

              <div className="card__corpo">
                <div>
                  <h3 className="card__titulo">
                    {veiculo.marca} {veiculo.modelo}
                  </h3>
                  {detalhes && <p className="card__detalhes">{detalhes}</p>}
                </div>

                <p className="vitrine-card__preco num">
                  {veiculo.mostrarPrecoNoSite
                    ? formatarBRL(veiculo.precoVenda)
                    : 'Consulte'}
                </p>

                {pendenciasVisiveis.length > 0 && (
                  <div className="vitrine-card__observacoes">
                    <span className="texto-suave">Observações:</span>
                    <ul>
                      {pendenciasVisiveis.map((p) => (
                        <li key={p.id}>
                          {p.descricao || 'Observação'}
                          {p.resolvida ? ' (resolvido)' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {urlWhatsApp ? (
                  <div className="card__contato">
                    <p className="card__cta">Ficou interessado? Nos contate!</p>
                    <a
                      className="botao botao--whatsapp"
                      href={urlWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconeWhatsapp size={18} />
                      Falar no WhatsApp
                    </a>
                  </div>
                ) : (
                  admin && (
                    <p className="card__whatsapp-dica texto-suave">
                      Configure o número em “Configurações” para ativar o botão
                      de WhatsApp.
                    </p>
                  )
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
