# QA Playwright + API Portfolio

Projeto de portfólio criado para demonstrar competências de QA Manual, API Testing, Postman, Swagger/OpenAPI, Playwright, SQL, documentação de testes e bug tracking.

## Stack
- Node.js + Express
- PostgreSQL
- Swagger/OpenAPI
- Playwright
- JavaScript
- Docker Compose
- Postman
- Git/GitHub

## Competências demonstradas

| Competência | Evidência |
|---|---|
| Testes manuais/funcionais | `docs/test-cases.md` |
| Cenários e casos de teste | `docs/test-cases.md` |
| API Testing | `tests/api/` |
| Postman | `postman/customers-api.postman_collection.json` |
| Swagger/OpenAPI | `openapi/openapi.yaml` |
| Playwright | `tests/ui/` e `tests/api/` |
| Automação | `playwright.config.js` |
| Bugs | `docs/bug-reports.md` |
| SQL | `database/init.sql` e `docs/sql-validation.md` |

## 1. Pré-requisitos
- Node.js 20+
- Docker e Docker Compose

## 2. Subir o banco

```bash
docker compose up -d db
```

## 3. Instalar dependências

```bash
npm install
npx playwright install
```

## 4. Iniciar a aplicação

```bash
npm run dev
```

A aplicação ficará em:
- Frontend: http://localhost:3001
- API: http://localhost:3001/customers
- Swagger: http://localhost:3001/api-docs
- Health: http://localhost:3001/health

## 5. Executar testes Playwright

```bash
npm test
```

Modo visual:

```bash
npm run test:headed
```

Relatório:

```bash
npm run report
```

## 6. Executar Postman

Importe `postman/QA Portfolio - Customers API.postman_collection.json` no Postman.

A collection cobre:
- GET customers
- paginação
- filtros
- cliente por ID
- POST
- PUT
- DELETE
- cenários negativos

## 7. Cenário do projeto

A empresa fictícia possui uma aplicação de gestão de clientes. O endpoint principal é:

`GET /customers`

Parâmetros:
- `page`: página, padrão 1
- `limit`: quantidade por página, padrão 10
- `size`: Small, Medium, Enterprise, Large Enterprise, Very Large Enterprise
- `industry`: Logistics, Retail, Technology, HR, Finance

O projeto contém deliberadamente um comportamento de validação que pode ser usado para exercício de bug reporting: valores inválidos de `size`/`industry` retornam 400, enquanto `page` e `limit` inválidos também devem retornar 400.

## 8. Fluxo recomendado para apresentar em entrevista

1. Ler `openapi/openapi.yaml`
2. Criar casos em `docs/test-cases.md`
3. Executar a collection do Postman
4. Validar dados com SQL
5. Executar testes Playwright
6. Abrir o relatório HTML
7. Explicar um bug de `docs/bug-reports.md`

## Estrutura

```text
qa-playwright-api-portfolio/
├── src/
│   ├── app.js
│   ├── db.js
│   └── public/
├── database/
│   └── init.sql
├── openapi/
│   └── openapi.yaml
├── postman/
│   └── customers-api.postman_collection.json
├── tests/
│   ├── api/
│   └── ui/
├── docs/
│   ├── test-cases.md
│   ├── bug-reports.md
│   └── sql-validation.md
├── docker-compose.yml
├── package.json
└── playwright.config.js
```
