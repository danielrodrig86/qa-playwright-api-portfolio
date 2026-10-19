# Bug Reports

Use these as portfolio examples only when you reproduce the behavior. Do not claim an issue is real without execution evidence.

## BUG-001  — Falta de validação de size e industry invalida no PUT

**Severity:** Medium  
**Priority:** Medium

**Environment:** Local QA

**Endpoint:** `GET /customers/id`

**Steps**
1. Send `PUT /customers/1`.
2. {"name":"Postman Customer Updated",
    "email": "postman-updated@demo.com",
    "size": "xxx",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- Clear validation message.

**Actual**
- Document the result after execution.

**Evidence**
- Postman response screenshot
- Playwright report if automated

**Status**
Open / Fixed / Retest

## BUG-002 — Falta de validação de nome e email apenas com espaços no POST e no PUT

**Severity:** Medium  
**Priority:** Medium

**Environment:** Local QA

**Endpoint:** `GET /customers`

**Steps**
1. Send `PUT /customers/id`.
2. {"name":"       ",
    "email": "postman-updated@demo.com",
    "size": "Enterprise",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- Clear validation message.

**Actual**
- Document the result after execution.

**Evidence**
- Postman response screenshot
- Playwright report if automated

**Status**
Open / Fixed / Retest

## BUG-003 — Falta de validação de email fora do padrão no POST e no PUT

**Severity:** Medium  
**Priority:** Medium

**Environment:** Local QA

**Endpoint:** `GET /customers`

**Steps**
1. Send `PUT /customers/id`.
2. {"name":"Postman Customer Updated",
    "email": "postman",
    "size": "Enterprise",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- Clear validation message.

**Actual**
- Document the result after execution.

**Evidence**
- Postman response screenshot
- Playwright report if automated

**Status**
Open / Fixed / Retest

## BUG-004 — Falta de validaão de email duplicado no PUT

**Severity:** Medium  
**Priority:** Medium

**Environment:** Local QA

**Endpoint:** `GET /customers`

**Steps**
1. Send `PUT /customers?size=invalid`.
2. {"name":"Postman Customer Updated",
    "email": "postman-updated@demo.com",
    "size": "Enterprise",
    "industry":"Technology"}
3. Inspect response.

**Expected**
- HTTP 400.
- Clear validation message.

**Actual**
- Document the result after execution.

**Evidence**
- Postman response screenshot
- Playwright report if automated

**Status**
Open / Fixed / Retest