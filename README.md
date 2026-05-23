# Product CRUD — Lippaus Case Técnico

Case técnico de desenvolvimento full stack para a Lippaus Distribuidora.

## 📦 Repositórios

| Projeto                    | Repositório                                         | Deploy                                                                                           |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Backend (Node.js + Prisma) | https://github.com/lenonmerlo/product-crud-api      | https://product-crud-api-production.up.railway.app                                               |
| Frontend (Next.js + Expo)  | https://github.com/lenonmerlo/product-crud-frontend | https://product-crud-frontend-three.vercel.app                                                   |
| Mobile (Expo)              | https://github.com/lenonmerlo/product-crud-frontend | https://expo.dev/accounts/lenonmerlo/projects/mobile/builds/c89f690b-bd70-4bfc-be97-888cea9122e6 |

## 🔗 Links de produção

- **Web:** https://product-crud-frontend-three.vercel.app
- **API:** https://product-crud-api-production.up.railway.app
- **Swagger:** https://product-crud-api-production.up.railway.app/api
- **Health:** https://product-crud-api-production.up.railway.app/health

## ✅ Checklist do enunciado

| Requisito                               | Status                                                                |
| --------------------------------------- | --------------------------------------------------------------------- |
| CRUD de produto                         | ✅                                                                    |
| Produtos ativos em destaque na listagem | ✅                                                                    |
| Validação em tela, backend e banco      | ✅                                                                    |
| Envio de imagem + miniatura na listagem | ✅                                                                    |
| App mobile (Expo)                       | ✅                                                                    |
| Página web (Next.js)                    | ✅                                                                    |
| Backend Node.js + Prisma                | ✅ [product-crud-api](https://github.com/lenonmerlo/product-crud-api) |
| Publicação em cloud                     | ✅ Railway (backend) + Vercel (web)                                   |
| Repositórios informados                 | ✅                                                                    |
| Extra: Autenticação de usuário          | ✅                                                                    |
| Extra: CI/CD GitHub Actions             | ✅                                                                    |

## 🗂 Estrutura do monorepo

```
product-crud-frontend/
├── web/        → Next.js (App Router)
└── mobile/     → Expo (React Native)
```

## 🚀 Como rodar

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
