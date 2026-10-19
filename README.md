# 🚗 Minha Garagem — Controle de Veículos

Sistema interno para controlar os veículos de uma garagem de revenda:
cadastro, fotos, pendências/avarias, cálculo de custo e uma prévia da
vitrine (como os carros apareceriam num site público).

Feito com **React + Vite**, pensado para ser **simples de manter**.
Por enquanto os dados ficam salvos **no próprio navegador** (localStorage);
no futuro dá para trocar por um banco de dados online (Supabase) **sem
mexer nas telas** — veja a seção "Trocar para o Supabase" mais abaixo.

---

## O que o sistema faz

- **Lista de veículos** com filtro por status e busca por marca/modelo/cor/placa.
- **Cadastro e edição** de veículos com:
  - marca, modelo, ano, cor, placa, quilometragem;
  - preço de compra e preço de venda;
  - opção "mostrar o preço no site" (se desligada, a vitrine mostra "Consulte");
  - status: em preparação, à venda, reservado, vendido;
  - fotos (reduzidas automaticamente para não pesar).
- **Pendências/avarias** por veículo (lista), cada uma com:
  - descrição, custo estimado, custo real;
  - "resolvida" (sim/não) e "mostrar no site" (sim/não).
  - 👉 **Só o custo real das pendências resolvidas entra no custo total do carro.**
- **Resumo** com custo total e lucro estimado.
- **Vitrine (prévia)**: mostra apenas os veículos "à venda" ou "reservados",
  respeitando as opções de mostrar preço e mostrar pendências.

---

## Como rodar no seu computador

Você só precisa fazer isso se quiser testar na sua própria máquina.
Para publicar na internet, pule para a seção seguinte.

1. **Instale o Node.js** (versão 18 ou mais nova): https://nodejs.org
   (baixe a versão "LTS" e instale como qualquer outro programa).
2. Abra o terminal **dentro da pasta do projeto** e rode uma vez:
   ```
   npm install
   ```
3. Para abrir o sistema no navegador (modo de desenvolvimento):
   ```
   npm run dev
   ```
   O terminal vai mostrar um endereço (algo como `http://localhost:5173/`).
   Abra esse endereço no navegador.
4. Para parar, aperte `Ctrl + C` no terminal.

---

## Como publicar na internet (GitHub Pages)

A publicação é **automática**: toda vez que a branch `main` recebe
novidades, o site é gerado e publicado sozinho.

**Você só precisa ligar o GitHub Pages uma única vez:**

1. No GitHub, abra o repositório.
2. Vá em **Settings** (Configurações) → **Pages**.
3. Em **Build and deployment → Source**, escolha **GitHub Actions**.
4. Pronto. A partir de agora, cada atualização na branch `main` publica o site.

O endereço do site será:
**https://jeferprog.github.io/Minha-Garagem-/**

> Dica: depois de enviar alterações, acompanhe a publicação na aba
> **Actions** do repositório. Quando o item ficar verde, o site está no ar.

---

## Como está organizado o projeto

```
src/
├─ data/
│  ├─ repository.js   ← ÚNICO lugar que acessa os dados (localStorage hoje)
│  └─ modelos.js      ← o que é um veículo/pendência + cálculo de custo
├─ utils/
│  └─ formato.js      ← formatar dinheiro, gerar id, reduzir fotos
├─ components/
│  ├─ VeiculoLista.jsx    ← tela da lista + filtros
│  ├─ VeiculoForm.jsx     ← tela de cadastro/edição
│  ├─ PendenciasEditor.jsx← lista de pendências dentro do formulário
│  └─ Vitrine.jsx         ← prévia do site público
├─ App.jsx           ← organiza as telas
├─ main.jsx          ← ponto de partida
└─ index.css         ← aparência (cores, espaçamentos)
```

Para mudar **cores e espaçamentos**, edite as variáveis no topo do
arquivo `src/index.css`.

---

## Trocar para o Supabase depois (sem mexer nas telas)

Todo o acesso a dados está isolado em **um único arquivo**:
`src/data/repository.js`.

As telas só conhecem estas quatro funções:

- `listarVeiculos()`
- `obterVeiculo(id)`
- `salvarVeiculo(veiculo)`
- `removerVeiculo(id)`

Quando quiser usar o Supabase, basta **reescrever o interior dessas
funções** para ler/gravar no Supabase, mantendo os mesmos nomes e o mesmo
comportamento (o que entra e o que sai). As telas continuam funcionando sem
nenhuma alteração. As funções já são assíncronas (usam `Promise`), que é
exatamente como o Supabase trabalha.

---

## Observações importantes

- Os dados ficam salvos **neste navegador, neste computador**. Se abrir em
  outro computador ou limpar os dados do navegador, a lista aparece vazia.
  Isso muda quando migrarmos para o Supabase.
- As fotos são guardadas junto com os dados do navegador, que tem espaço
  limitado. Por isso elas são reduzidas automaticamente ao serem adicionadas.
  Use poucas fotos por veículo enquanto estivermos no localStorage.
