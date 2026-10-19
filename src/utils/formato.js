// Funções auxiliares de formatação e de imagem usadas pelas telas.

// Mostra um número como dinheiro em reais. Ex.: 35000 -> "R$ 35.000,00"
export function formatarBRL(valor) {
  const numero = Number(valor) || 0
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Como formatarBRL, mas sem os centavos. Útil para somas grandes (KPIs).
// Ex.: 2450000 -> "R$ 2.450.000"
export function formatarBRLCompacto(valor) {
  const numero = Number(valor) || 0
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

// Mostra um número com separador de milhar. Ex.: 48000 -> "48.000"
export function formatarNumero(valor) {
  const numero = Number(valor) || 0
  return numero.toLocaleString('pt-BR')
}

// Gera um identificador único para cada veículo/pendência.
export function gerarId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2)
}

// Reduz o tamanho de uma foto antes de salvar, para não lotar o
// armazenamento do navegador. Recebe o arquivo escolhido e devolve
// a imagem já reduzida em formato de texto (data URL), pronta para salvar.
export function redimensionarImagem(arquivo, maxLado = 1000, qualidade = 0.7) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()

    leitor.onload = () => {
      const imagem = new Image()

      imagem.onload = () => {
        let largura = imagem.width
        let altura = imagem.height

        // Mantém a proporção e limita o maior lado a "maxLado".
        if (largura > altura && largura > maxLado) {
          altura = Math.round((altura * maxLado) / largura)
          largura = maxLado
        } else if (altura >= largura && altura > maxLado) {
          largura = Math.round((largura * maxLado) / altura)
          altura = maxLado
        }

        const canvas = document.createElement('canvas')
        canvas.width = largura
        canvas.height = altura
        const contexto = canvas.getContext('2d')
        contexto.drawImage(imagem, 0, 0, largura, altura)

        resolver(canvas.toDataURL('image/jpeg', qualidade))
      }

      imagem.onerror = () => rejeitar(new Error('Não foi possível ler a imagem.'))
      imagem.src = leitor.result
    }

    leitor.onerror = () => rejeitar(new Error('Não foi possível abrir o arquivo.'))
    leitor.readAsDataURL(arquivo)
  })
}
