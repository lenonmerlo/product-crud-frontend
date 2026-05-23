# Product CRUD - Lippaus Case Tecnico

[![CI](https://github.com/lenonmerlo/product-crud-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/lenonmerlo/product-crud-frontend/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16.2.6-000000?logo=nextdotjs&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Web%20Deploy-000000?logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-API%20Deploy-0B0D0E?logo=railway&logoColor=white)

Case tecnico de desenvolvimento full stack para a Lippaus Distribuidora.

## Repositorios

| Projeto                    | Repositório                                         | Deploy                                                                                           |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Backend (Node.js + Prisma) | https://github.com/lenonmerlo/product-crud-api      | https://product-crud-api-production.up.railway.app                                               |
| Frontend (Next.js + Expo)  | https://github.com/lenonmerlo/product-crud-frontend | https://product-crud-frontend-three.vercel.app                                                   |
| Mobile (Expo/Android)      | https://github.com/lenonmerlo/product-crud-frontend | https://expo.dev/accounts/lenonmerlo/projects/mobile/builds/c89f690b-bd70-4bfc-be97-888cea9122e6 |

## Links de producao

- **Web:** https://product-crud-frontend-three.vercel.app
- **API:** https://product-crud-api-production.up.railway.app
- **Swagger:** https://product-crud-api-production.up.railway.app/api
- **Health:** https://product-crud-api-production.up.railway.app/health

## Checklist do enunciado

| Requisito                               | Status                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------- |
| CRUD de produto                         | Atendido                                                                    |
| Produtos ativos em destaque na listagem | Atendido                                                                    |
| Validacao em tela, backend e banco      | Atendido                                                                    |
| Envio de imagem + miniatura na listagem | Atendido                                                                    |
| App mobile (Expo)                       | Atendido                                                                    |
| Pagina web (Next.js)                    | Atendido                                                                    |
| Backend Node.js + Prisma                | Atendido [product-crud-api](https://github.com/lenonmerlo/product-crud-api) |
| Publicacao em cloud                     | Atendido (Railway no backend e Vercel na web)                               |
| Repositorios informados                 | Atendido                                                                    |
| Extra: Autenticacao de usuario          | Atendido                                                                    |
| Extra: CI/CD GitHub Actions             | Atendido                                                                    |

## Estrutura do monorepo

```
product-crud-frontend/
├── web/        -> Next.js (App Router)
└── mobile/     -> Expo (React Native)
```

## Como rodar

### Web

```bash
cd web
npm install
cp .env.local.example .env.local  # configure NEXT_PUBLIC_API_URL
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```
