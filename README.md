# CodeLeap Test - React + Vite

Aplicacao frontend do desafio CodeLeap, desenvolvida com React e Vite.

## Deploy

- URL: https://codeleap-mu.vercel.app/

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Rode o projeto em modo desenvolvimento:

```bash
npm run dev
```

3. Abra no navegador o endereco exibido no terminal (normalmente `http://localhost:5173`).

## Scripts disponiveis

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera build de producao
- `npm run preview`: sobe a build localmente para teste
- `npm run lint`: roda validacoes com ESLint

## Como o projeto funciona

### 1) Login (Sign up)

- A primeira tela pede um username.
- O username e salvo no `localStorage` (`codeleap-username`) para manter sessao local.

### 2) Feed principal

- Cria, lista, edita e remove posts usando a API:
  - `https://dev.codeleap.co.uk/careers/`
- O filtro por username usa query params da API (`?username=...`).
- Existe ordenacao por data:
  - mais recentes
  - mais antigos

### 3) Engajamento local (likes e comentarios)

- Likes e comentarios sao salvos localmente no `localStorage`:
  - chave: `codeleap-post-engagement`
- Regras:
  - cada usuario pode curtir/descurtir
  - comentario so pode ser removido pelo mesmo usuario que comentou
  - exclusao de comentario e post usa modal de confirmacao

### 4) Logout

- O botao de logout remove apenas o username salvo.
- O engajamento local (likes/comentarios) permanece salvo.

## Estrutura principal

- `src/components`: telas e componentes visuais
- `src/context`: estados globais (usuario e engajamento)
- `src/api/postsApi.js`: integracao com backend
- `src/utils/relativeTime.js`: formatacao de tempo relativo
