# 🚗 Minha Garagem — Controle de Veículos

Sistema interno para controlar os veículos de uma garagem de revenda:
cadastro, fotos, pendências/avarias, cálculo de custo e uma prévia da
vitrine (como os carros apareceriam num site público).

Feito com **React + Vite**, pensado para ser **simples de manter**.
Os dados ficam salvos **online no Supabase** — por isso aparecem em
qualquer dispositivo e a vitrine é realmente pública. Veja a seção
"Banco de dados (Supabase)" para a configuração.

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
**https://jeferprog.github.io/Minha-Garagem/**

> Dica: depois de enviar alterações, acompanhe a publicação na aba
> **Actions** do repositório. Quando o item ficar verde, o site está no ar.

---

## Como está organizado o projeto

```
src/
├─ data/
│  ├─ repository.js   ← ÚNICO lugar que acessa os dados (Supabase)
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

## Banco de dados (Supabase)

Os dados ficam no **Supabase** (banco de dados online). Todo o acesso a
dados está isolado em `src/data/repository.js`, e a conexão fica em
`src/supabase.js` (endereço e chave **pública** do projeto — pode ficar no
código, a segurança vem das regras do banco e do login).

**Configuração inicial (uma vez só), no painel do Supabase:**

1. **SQL Editor → New query** → cole o conteúdo de `supabase/schema.sql`
   e clique em **Run**. Isso cria as tabelas e as regras de segurança.
2. **Authentication → Users → Add user** → crie seu usuário de
   administrador (e-mail + senha) e marque **Auto Confirm User**.
3. **Authentication → Providers → Email** → desligue
   **"Allow new users to sign up"** (assim só você tem acesso de admin).

As regras de segurança (RLS) deixam **qualquer pessoa ver** a vitrine
(pela *view* `vitrine`, que mostra só dados públicos — sem preço de compra,
custos ou pendências internas), mas só o **administrador logado**
cadastrar/editar/excluir.

As **fotos** ficam no **Storage** do Supabase (bucket `fotos-veiculos`),
não dentro do banco: assim o banco fica leve e as imagens carregam rápido.
No cadastro do veículo guardamos só o **link** de cada foto.

---

## Vitrine pública e administração

- A **Vitrine** é pública: qualquer pessoa que abrir o site vê os veículos
  "à venda" e "reservados".
- As **demais telas** (lista, cadastro/edição e configurações) são da
  administração e pedem **login** (e-mail e senha do Supabase). É só clicar
  em **Administração** e entrar com o usuário criado no painel do Supabase.
- Na aba **Configurações** (dentro da administração) você define o
  **número de WhatsApp** que recebe os contatos vindos da vitrine.
- Quando ainda não há veículos à venda/reservados, a vitrine mostra alguns
  **veículos de exemplo** (ilustração) só para dar ideia de como fica.

## Observações importantes

- Os dados ficam salvos **online no Supabase**, então aparecem em qualquer
  computador ou celular. A vitrine é pública e o cadastro é só do admin.
- As fotos são reduzidas automaticamente ao serem adicionadas (para não
  pesar) e hoje ficam guardadas junto com os dados do veículo. Se um dia o
  volume de fotos crescer muito, dá para movê-las para o "Storage" do
  Supabase (armazenamento próprio para imagens) — é só pedir.
