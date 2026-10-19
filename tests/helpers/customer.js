import { randomUUID } from 'node:crypto'

export async function createCustomer(request, customerData = {}, { omitFields = [] } = {}) {
    const uniqueId = randomUUID()

    // 1. Definimos os valores padrão base separadamente
    const defaultValues = {
        name: `Playwright Customer ${uniqueId}`,
        email: `playwright.${uniqueId}@demo.com.br`,
        size: 'Medium',
        industry: 'Technology'
    }

    const payload = {}

    // 2. Para cada campo padrão, decidimos o valor a ser enviado:
    // - Se a propriedade foi explicitamente enviada em customerData (mesmo que vazia: "", null, etc.), usamos ela.
    // - Caso contrário, usamos o valor padrão.
    for (const key of Object.keys(defaultValues)) {
        if (Object.prototype.hasOwnProperty.call(customerData, key)) {
            payload[key] = customerData[key] // Pega o valor enviado (pode ser vazio/null)
        } else {
            payload[key] = defaultValues[key] // Usa o padrão se não foi informado
        }
    }

    // 3. Permite também enviar campos extras que não estão nos padrões originais (se houver)
    for (const [key, value] of Object.entries(customerData)) {
        if (!payload.hasOwnProperty(key)) {
            payload[key] = value
        }
    }

    // 4. Remove os campos solicitados no omitFields
    for (const field of omitFields) {
        delete payload[field]
    }

    const response = await request.post('/customers', {
        data: payload
    })

    let data

    try {
        data = await response.json()
    } catch {
        data = null
    }
    
    return {
        status: response.status(),
        data
    }
}

export async function getCustomer(request,customerId) {
    const response = await request.get(`/customers/${customerId}`)
    return { status: response.status(), 
             headers: response.headers()['content-type'],
             data: await response.json() }
}

export async function putCustomer(request,customerId, customerData = {}, { omitFields = [] } = {}) {
    const timestamp = Date.now()

    // 1. Definimos os valores padrão base separadamente
    const defaultValues = {
        name: `Playwright Customer ${timestamp}`,
        email: `playwright-${timestamp}@demo.com`,
        size: 'Medium',
        industry: 'Technology'
    }

    const payload = {}

    // 2. Para cada campo padrão, decidimos o valor a ser enviado:
    // - Se a propriedade foi explicitamente enviada em customerData (mesmo que vazia: "", null, etc.), usamos ela.
    // - Caso contrário, usamos o valor padrão.
    for (const key of Object.keys(defaultValues)) {
        if (Object.prototype.hasOwnProperty.call(customerData, key)) {
            payload[key] = customerData[key] // Pega o valor enviado (pode ser vazio/null)
        } else {
            payload[key] = defaultValues[key] // Usa o padrão se não foi informado
        }
    }

    // 3. Permite também enviar campos extras que não estão nos padrões originais (se houver)
    for (const [key, value] of Object.entries(customerData)) {
        if (!payload.hasOwnProperty(key)) {
            payload[key] = value
        }
    }

    // 4. Remove os campos solicitados no omitFields
    for (const field of omitFields) {
        delete payload[field]
    }

    const response = await request.put(`/customers/${customerId}`, {
        data: payload
    })

    return {
        status: response.status(),
        data: await response.json()
    }
} 

export async function deleteCustomer(request, customerId) {
    return await request.delete(`/customers/${customerId}`)
}

export async function getCustomers(request, customerParameters = {}) {
    const params = new URLSearchParams()
    if (customerParameters.page !== undefined) {
        params.append('page', customerParameters.page)}
    if (customerParameters.limit !== undefined) {
        params.append('limit', customerParameters.limit) }
    if (customerParameters.size !== undefined) {
        params.append('size', customerParameters.size) }
    if (customerParameters.industry !== undefined) {
        params.append('industry', customerParameters.industry) }
    
    const response = await request.get(`/customers?${params.toString()}`)
    return { status: response.status(), 
             data: await response.json() }
}
