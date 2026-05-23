# Product CRUD Mobile (Expo/Android)

![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Android Build](https://img.shields.io/badge/Android%20Build-EAS-3DDC84?logo=android&logoColor=white)
![API](https://img.shields.io/badge/API-Railway-0B0D0E?logo=railway&logoColor=white)

Aplicativo mobile do case tecnico da Lippaus para cadastro, edicao e organizacao de produtos.

## Repositorio e links

- Repositorio frontend: https://github.com/lenonmerlo/product-crud-frontend
- Build mobile (Expo/Android): https://expo.dev/accounts/lenonmerlo/projects/mobile/builds/c89f690b-bd70-4bfc-be97-888cea9122e6
- Deploy web: https://product-crud-frontend-three.vercel.app
- API: https://product-crud-api-production.up.railway.app
- Swagger API: https://product-crud-api-production.up.railway.app/api

## Stack

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript
- Axios
- React Hook Form + Zod
- Expo Image Picker
- Expo Secure Store

## Requisitos

- Node.js 20+
- npm 10+
- Expo Go (opcional, para testes em dispositivo)

## Variaveis de ambiente

Crie (ou ajuste) o arquivo .env na pasta mobile:

```env
EXPO_PUBLIC_API_URL=https://product-crud-api-production.up.railway.app
```

Se nao informado, o app usa fallback para http://localhost:3333.

## Como rodar

```bash
cd mobile
npm install
npx expo start
```

Atalhos uteis:

- npm run android
- npm run ios
- npm run web

## Funcionalidades implementadas

- Login e cadastro de usuario
- Persistencia de token com Secure Store
- Listagem de produtos com busca
- Destaque visual para produtos ativos e inativos
- Criacao e edicao de produto
- Exclusao de produto
- Upload de imagem por produto
- Exibicao de miniatura na listagem
- Saudacao no topo com nome do usuario

## Estrutura do app

```text
mobile/
├── App.tsx
├── src/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── schemas.ts
│   │   └── types.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ProductsScreen.tsx
│   │   └── ProductFormScreen.tsx
│   └── services/
│       └── products-service.ts
└── app.json
```

## Fluxo principal

1. App.tsx valida token e decide rota inicial.
2. Login/Register autenticam e salvam accessToken e user no Secure Store.
3. ProductsScreen busca produtos na API e aplica filtro de busca.
4. ProductFormScreen cria/edita produto e envia imagem.
5. products-service.ts centraliza chamadas do CRUD.

## Observacoes

- A validacao em tela e feita com Zod + React Hook Form.
- O backend e responsavel pela validacao em camada de API e banco.
- Em resposta 401, o token e removido automaticamente do Secure Store.
