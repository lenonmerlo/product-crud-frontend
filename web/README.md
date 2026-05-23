# Product CRUD Frontend (web)

[![CI](https://github.com/lenonmerlo/product-crud-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/lenonmerlo/product-crud-frontend/actions/workflows/ci.yml)

Aplicação frontend do case técnico, construída com Next.js (App Router), foco em autenticação por token, fluxo CRUD de produtos e cobertura de testes.

- **Web:** https://product-crud-frontend-three.vercel.app

![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-20232a?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-0F172A?logo=tailwindcss&logoColor=38BDF8)
![Vitest](https://img.shields.io/badge/Vitest-4.x-1a1a1a?logo=vitest&logoColor=FCC72B)
![Playwright](https://img.shields.io/badge/Playwright-1.60-2EAD33?logo=playwright&logoColor=white)
![Node](https://img.shields.io/badge/Node-%3E%3D20-5FA04E?logo=nodedotjs&logoColor=white)
![NPM](https://img.shields.io/badge/npm-%3E%3D10-CB3837?logo=npm&logoColor=white)

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- React Hook Form + Zod
- Vitest + Testing Library
- Playwright

## Requisitos

- Node.js 20+
- npm 10+

## Variáveis de ambiente

Crie (ou ajuste) o arquivo `.env.local` na pasta `web`:

```env
NEXT_PUBLIC_API_URL=https://product-crud-api-production.up.railway.app
```

Se não informado, a aplicação usa fallback para `http://localhost:3333`.

## Como rodar localmente

```bash
npm install
npm run dev
```

Aplicação em: `http://localhost:3000`

## Scripts

- `npm run dev`: ambiente de desenvolvimento.
- `npm run build`: build de produção.
- `npm run start`: sobe app compilado.
- `npm run lint`: validação de lint.
- `npm run test`: alias para unit/component.
- `npm run test:unit`: testes unitários/componentes com cobertura.
- `npm run test:watch`: Vitest em modo watch.
- `npm run test:e2e`: testes E2E com Playwright.
- `npm run test:e2e:ui`: runner visual do Playwright.
- `npm run test:e2e:install`: instala browser do Playwright (Chromium).

## Arquitetura resumida

- `src/app`: rotas e páginas (App Router).
- `src/components`: componentes reutilizáveis de UI e domínio.
- `src/services`: camada de acesso a dados (API de produtos).
- `src/hooks`: hooks de orquestração de estado.
- `src/lib`: utilitários compartilhados (cliente API, schemas, tipos, erros).
- `src/proxy.ts`: proteção de rotas com base em cookie `accessToken`.

## Arquitetura em prática (exemplo)

```text
src/
├─ app/
│  ├─ (auth)/
│  │  ├─ login/page.tsx
│  │  └─ register/page.tsx
│  ├─ products/
│  │  ├─ page.tsx
│  │  ├─ new/page.tsx
│  │  └─ [id]/edit/page.tsx
│  └─ layout.tsx
├─ components/
│  ├─ products/
│  │  ├─ ProductCard.tsx
│  │  └─ ProductForm.tsx
│  └─ ui/
├─ hooks/
│  └─ useProducts.ts
├─ services/
│  └─ products-service.ts
├─ lib/
│  ├─ api.ts
│  ├─ api-error.ts
│  ├─ schemas.ts
│  └─ types.ts
└─ proxy.ts
```

Fluxo real de uma tela de edição de produto:

1. `src/app/products/[id]/edit/page.tsx` carrega os dados iniciais e orquestra ações.
2. `src/components/products/ProductForm.tsx` centraliza validação, estado de formulário e upload de imagem.
3. `src/services/products-service.ts` encapsula chamadas HTTP (GET/PUT/UPLOAD).
4. `src/lib/api.ts` injeta token via interceptor e trata `401` para redirecionar login.
5. `src/proxy.ts` reforça proteção de rota no nível de navegação por cookie.

## Autenticação e proteção de rotas

- Rotas protegidas: `/products`.
- Rotas de convidado: `/login`, `/register`.
- O proxy redireciona:
  - sem token em rota protegida -> `/login`
  - com token em rota de convidado -> `/products`

## Testes

### Unitários e componentes

```bash
npm run test:unit
```

Inclui cobertura (V8) e gera relatório em `coverage/`.

### E2E

```bash
npm run test:e2e:install
npm run test:e2e
```

O Playwright sobe o app automaticamente via `npm run dev` durante a execução.

## Qualidade

Pipeline mínima recomendada antes de entregar:

```bash
npm run lint
npm run test:unit
npm run test:e2e
npm run build
```
