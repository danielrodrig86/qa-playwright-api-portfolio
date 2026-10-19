# Test Cases

## TC-001 — Testar conexão com o Banco
**Priority:** High

**Steps**
1. Send GET `/health`.
2. Inspect response.

**Expected**
- HTTP 200.
- `status: 'ok',  database: 'connected'`

## TC-002 — GET — Testar se api /costumers retorna respostra esperada
**Priority:** High

**Steps**
1. Send GET `/custumers`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 10
- totalReturned : 10
- customers : quantidade retornada <= 10

## TC-003 — GET — Testar se api /customers?page=1&limit=5 retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers?page=1&limit=5`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 5
- totalReturned : 5
- customers : quantidade retornada <= 5

## TC-004 — GET — Testar se api /customers?limit=4&size=Medium retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers?limit=4&size=Medium`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 4
- totalReturned : 4
- customers : Todos tevem ter "size": "Medium" + quantidade retornada <= 4

## TC-005 — GET — Testar se api /customers?page=3&limit=20&size=Medium&industry=Technology retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers/?page=3&limit=20&size=Medium&industry=Technology`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 3
- limit : 20
- size : Medium
- industry : Technology
- totalReturned : 20
- customers : Todos tevem ter "size": "Medium" + "industry": "Technology" + quantidade retornada <= 20

## TC-006 — GET — Testar se api /customers?size=Medium retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers?size=Medium`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 10
- totalReturned <= 10
- customers : Todos tevem ter "size": "Medium" + quantidade retornada <= 10

## TC-007 — GET — Testar se api /customers?industry=Technology retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers?industry=Technology`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 10
- totalReturned <= 10
- customers : Todos tevem ter "industry": "Technology" + quantidade retornada <= 10

## TC-008 — GET — Testar se api /customers?size=Medium&industry=HR retorna os dados corretos
**Priority:** Medium

**Steps**
1. Send GET `/customers?size=Medium&industry=HR`.
2. Inspect response.

**Expected**
- HTTP 200.
- page : 1
- limit : 10
- totalReturned <= 10
- customers : Todos tevem ter size=Medium + "industry": "HR" + quantidade retornada <= 10

## TC-009 — GET — Testar se api /customers?page=abc (page invalida) retorna o erro
**Priority:** Medium

**Steps**
1. Send GET `/customers?page=abc`.
2. Inspect response.

**Expected**
- HTTP 400.
- `"error":"page must be an integer greater than or equal to 1"`

## TC-010 — GET — Testar se api /customers?limit=abc (limit invalida) retorna o erro
**Priority:** Medium

**Steps**
1. Send GET `/customers?limit=abc`.
2. Inspect response.

**Expected**
- HTTP 400.
- `"error":"limit must be an integer between 1 and 100"`



## TC-011 — GET — Testar se api /customers?size=abc (size invalida) retorna o erro
**Priority:** Medium

**Steps**
1. Send GET `/customers?size=abc`.
2. Inspect response.

**Expected**
- HTTP 400.
- `"error""size must be one of: Small, Medium, Enterprise, Large Enterprise, Very Large Enterprise"`

## TC-012 — GET — Testar se api /customers?industry=abc (industry invalida) retorna o erro
**Priority:** Medium

**Steps**
1. Send GET `/customers?industry=abc`.
2. Inspect response.

**Expected**
- HTTP 400.
- `"error""industry must be one of: Logistics, Retail, Technology, HR, Finance"`

## TC-013 — GET — Buscar cliente por ID /costumers/1
**Priority:** Medium

**Steps**
1. Send GET `/customers/1`.
2. Inspect response.

**Expected**
- HTTP 200.
- id : 1
- name : ...
- email : ...
- size : ...
- industry : ...
- "created_at":"...

## TC-014 — GET — Buscar cliente inexistente por ID /costumers/83
**Priority:** Medium

**Steps**
1. Send GET `/customers/83`.
2. Inspect response.

**Expected**
- HTTP 404.
- `"customer not found"`

## TC-015 — GET — Buscar cliente ID Invalido /costumers/abc
**Priority:** Medium

**Steps**
1. Send GET `/customers/abc`.
2. Inspect response.

**Expected**
- HTTP 404.
- `"id must be a positive integer"`

## TC-016 — GET — Dados retornados seguem a estrutura do contrato
**Priority:** Medium

**Steps**
1. Send GET `/customers/1`.
2. Inspect response.

**Expected**
- HTTP 200.
- valor de id = Number
- valor de name = String
- valor de email = String
- valor de size = String
- valor de industry = String
- valor de created_at = String

## TC-017 — GET — Valor limite do campo limit
**Priority:** Medium

**Steps**
1. Send GET `/customers?limit=101`.
2. Inspect response.

**Expected**
- HTTP 400.
- `"error""limit must be an integer between 1 and 100"`

## TC-018 — POST — Criar cliente
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "email": "postman-demo@demo9.com",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 201.
- `{"id":...,"name":"...","email":"...","size":"...","industry":"...","created_at":"..."}`

## TC-019 — POST — Criar cliente com um email existente
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "email": "postman-demo@demo.com",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 409.
- `'email already exists`

## TC-020 — POST — Criar cliente com size errado
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "email": "postman-demo@demo.com",
    "size": "xxx",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `'invalid size or industry`

## TC-021 — POST — Criar cliente com industry errado
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "email": "postman-demo@demo.com",
    "size": "Medium",
    "industry":"xxx"}
3. Inspect response.

**Expected**
- HTTP 400.
- `'invalid size or industry`

## TC-022 — POST — Criar cliente sem name
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"email": "postman-demo@demo9.com",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-023 — POST — Criar cliente sem email
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-024 — POST — Criar cliente sem size
**Priority:** Medium

**Steps**
1. Send POST `/costumers`.
2. {"name":"Postman Customer",
    "email": "postman-demo@demo9.com",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-025 — POST — Criar cliente sem industria
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "size": "Medium"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-026 — POST — Criar cliente com Email invalido
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer",
    "email": "postman",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `invalid email format`

## TC-027 — PUT — Atualizar cliente
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name":"Postman Customer Updated",
    "email": "postman-updated@demo.com",
    "size": "Enterprise",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 200.
- `{"id":...,"name":"...","email":"...","size":"...","industry":"...","created_at":"..."}`


## TC-028 — PUT — Atualizar cliente com um email existente
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name":"Postman Customer",
    "email": "postman-updated@demo.com",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 409.
- `'email already exists`

## TC-029 — PUT — Atualizar cliente com size errado
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name":"Postman Customer",
    "email": "postman-updated@demo.com",
    "size": "xxx",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `'invalid size or industry`

## TC-030 — PUT — Atualizar cliente com industry errado
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name":"Postman Customer",
    "email": "postman-updated@demo.com",
    "size": "Medium",
    "industry":"xxx"}
3. Inspect response.

**Expected**
- HTTP 400.
- `'invalid size or industry`

## TC-031 — PUT — Atualizar sem name
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"email": "postman-updated@teste.com",
  "size": "Enterprise",
  "industry": "Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-032 — PUT — Atualizar sem email
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name": "Postman Customer Updated",
  "size": "Enterprise",
  "industry": "Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-033 — PUT — Atualizar sem size 
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name": "Postman Customer Updated",
  "email": "postman-updated@teste.com",
  "industry": "Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-034 — PUT — Atualizar sem industria
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name": "Postman Customer Updated",
  "email": "postman-updated@teste.com",
  "size": "Enterprise"}
3. Inspect response.

**Expected**
- HTTP 400.
- `name, email, size and industry are required`

## TC-035 — PUT — Atualizar com o id do cliente invalido
**Priority:** Medium

**Steps**
1. Send PUT `/customers/invalidId`.
2. {"name": "Postman Customer Updated",
  "email": "postman-updated@teste.com",
  "size": "Enterprise",
  "industry": "Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `id must be a positive integer`

## TC-036 — PUT — Atualizar cliente com Email invalido
**Priority:** Medium

**Steps**
1. Send PUT `/customers/id`.
2. {"name":"Postman Customer",
    "email": "postman",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- `invalid email format`

## TC-037 — DELETE — Deletar um cliente
**Priority:** Medium

**Steps**
1. Send DELETE `/customers/id`.
2. Inspect response.

**Expected**
- HTTP 204.
- `''`

## TC-038 — DELETE — Deletar um cliente que não existe
**Priority:** Medium

**Steps**
1. Send DELETE `/customers/IdAlreadyDeleted`.
2. Inspect response.

**Expected**
- HTTP 404.
- `'customer not found'`

## TC-039 — DELETE — Deletar com um id invalido
**Priority:** Medium

**Steps**
1. Send DELETE `/customers/abc`.
2. Inspect response.

**Expected**
- HTTP 400.
- `'id must be a positive integer'`

## TC-040 — CRUD — POST — Cria um cliente e salva o ID
**Priority:** Medium

**Steps**
1. Send POST `/customers`.
2. {"name":"Postman Customer ID",
    "email": "postman@{{customerId}}.com",
    "size": "Medium",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 201.
- `Retorna e salva o {{customerId}} criado`

## TC-041 — CRUD — GET — Confirma que o cliente {{customerId}} foi criado 

**Priority:** Medium

**Steps**
1. Send GET `/customers/{{customerId}}`.
2. Inspect response.

**Expected**
- HTTP 200.
- `Retorna o {{customerId}} criado`

## TC-042 — CRUD — PUT — Altera alguma dado no {{customerId}}
**Priority:** Medium

**Steps**
1. Send PUT `/customers/{{customerId}}`.
2. {"name": "Postman Customer Updated",
  "email": "postman-updated@{{customerId}}.com",
  "size": "Enterprise",
  "industry": "Technology"}
3. Inspect response.

**Expected**
- HTTP 200.
- `Retorna o {{customerId}} criado`

## TC-043 — CRUD — GET — Confirma que o cliente {{customerId}} foi alterado 
**Priority:** Medium

**Steps**
1. Send GET `/customers/{{customerId}}`.
2. Inspect response.

**Expected**
- HTTP 200.
- `Retorna o {{customerId}} alterado com os novos dados`

## TC-044 — CRUD — DELETE — Deleta o {{customerId}} criado e alterado
**Priority:** Medium

**Steps**
1. Send DELETE `/customers/{{customerId}}`.
2. Inspect response.

**Expected**
- HTTP 204.
- `Retorna ''`

## TC-045 — CRUD — GET — Confirma que o {{customerId}} foi deletado
**Priority:** Medium

**Steps**
1. Send GET `/customers/{{customerId}}`.
2. Inspect response.

**Expected**
- HTTP 404.
- `Retorna o 'customer not found'`





