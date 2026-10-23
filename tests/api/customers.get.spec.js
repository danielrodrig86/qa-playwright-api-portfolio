import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'
import { getCustomer, getCustomers, deleteCustomer } from '../helpers/customer'

test.describe('GET /customers', () => {
    test.describe('Pagination', () => {

      test('returns customers with default pagination', async ({ request }) => {

        const response = await getCustomers(request)
        expect(response.status).toBe(200)
        expect(response.data.page).toBe(1)
        expect(response.data.limit).toBe(10)
        expect(response.data.totalReturned).toBe(10)
        expect(response.data.totalReturned).toBe(response.data.customers.length)  
    }) 

    const invalidPage = [ 0, -1, 'abc']

        for (const page of invalidPage) {
            test(`rejects invalid page = ${page}`, async ({ request }) => {

                const response = await getCustomers(request, {page})

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('page must be an integer greater than or equal to 1')
            })
        }   
  })

  test.describe('Filters', () => {

    const filterScenarios = [
        {
            description: 'filters customers by size',
            filters: { size: 'Medium' },
            expectedSize: 'Medium'
        },
        {
            description: 'filters customers by industry',
            filters: { industry: 'Technology' },
            expectedIndustry: 'Technology'
        },
        {
            description: 'filters customers by size and industry',
            filters: {
                size: 'Medium',
                industry: 'Technology'
            },
            expectedSize: 'Medium',
            expectedIndustry: 'Technology'
        }
    ]

    for (const scenario of filterScenarios) {
        test(scenario.description, async ({ request }) => {

            const response = await getCustomers( request, scenario.filters )

            expect(response.status).toBe(200)

            for (const customer of response.data.customers) {
                if (scenario.expectedSize) {
                    expect(customer.size).toBe( scenario.expectedSize )
                }

                if (scenario.expectedIndustry) {
                    expect(customer.industry).toBe( scenario.expectedIndustry )
                }
            }
        })
    }

      test('rejects invalid size', async ({ request }) => {

        const response = await getCustomers(request,{ size : 'invalid'} )
        expect(response.status).toBe(400)
        expect(response.data.error).toBe('size must be one of: Small, Medium, Enterprise, Large Enterprise, Very Large Enterprise')
      })

      test('rejects invalid industry', async ({ request }) => {

        const response = await getCustomers(request,{ industry: 'Invalid'})
        expect(response.status).toBe(400)
        expect(response.data.error).toBe('industry must be one of: Logistics, Retail, Technology, HR, Finance')
      })
  })

  test.describe('IDs', () => {

      test('returns a customer by id ', async ({ request, customer }) => {

          const response = await getCustomer(request,customer.id)
          expect(response.data.id).toBe(customer.id)
          expect(response.data.name).toBe(customer.name)
          expect(response.data.email).toBe(customer.email)
          expect(response.data.size).toBe(customer.size)
          expect(response.data.industry).toBe(customer.industry)
        })

      test('returns 404 for a nonexistent customer', async ({ request, customer }) => {

          const response2 = await deleteCustomer(request,customer.id)
          expect(response2.status()).toBe(204)

          const response = await getCustomer(request,customer.id)
          expect(response.status).toBe(404)
          expect(response.data.error).toBe('customer not found')
        })

      test('returns 400 for a invalid customer', async ({ request }) => {

          const response = await getCustomer(request,'abc')
          expect(response.status).toBe(400)
          expect(response.data.error).toBe('id must be a positive integer')
        })
  })

  test.describe('Response structure', () => {

      test('validates customer response structure', async ({ request, customer }) => {

          const response = await getCustomer(request,customer.id)
          expect(response.data).toHaveProperty('id')
          expect(response.data).toHaveProperty('name')
          expect(response.data).toHaveProperty('email')
          expect(response.data).toHaveProperty('size')
          expect(response.data).toHaveProperty('industry')
          expect(response.data).toHaveProperty('created_at')
        })

          test('validates customer response data types', async ({ request, customer }) => {

          const response = await getCustomer(request,customer.id)
          expect(response.data.id).toEqual(expect.any(Number))
          expect(response.data.name).toEqual(expect.any(String))
          expect(response.data.email).toEqual(expect.any(String))
          expect(response.data.size).toEqual(expect.any(String))
          expect(response.data.industry).toEqual(expect.any(String))
          expect(response.data.created_at).toEqual(expect.any(String))
        })
  })

  test.describe('Headers', () => {

      test('validates content type on successful response', async ({ request, customer }) => {

          const response = await getCustomer(request,customer.id)
          expect(response.status).toBe(200)
          expect(response.headers).toContain('application/json')
        })

      test('validates content type on error response', async ({ request, customer }) => {

          const response2 = await deleteCustomer(request,customer.id)
          expect(response2.status()).toBe(204)

          const response = await getCustomer(request,customer.id)
          expect(response.status).toBe(404)
          expect(response.headers).toContain('application/json')
        })
  })

  test.describe('Boundary values', () => {
        const validLimits  = [ 1, 100, 10, 50]

        for (const limit of validLimits) {
            test(`accepts limit = ${limit}`, async ({ request }) => {
                const response = await getCustomers(request, {limit})

                expect(response.status).toBe(200)
                expect(response.data.page).toBe(1)
                expect(response.data.limit).toBe(limit)
                expect(response.data.totalReturned).toBe(response.data.customers.length)
                expect(response.data.totalReturned).toBeLessThanOrEqual(limit)
            })
        }

        const invalidLimits  = [ 101, 0, -1, 'abc']

        for (const limit of invalidLimits) {
            test(`rejects invalid limit = ${limit}`, async ({ request }) => {
                const response = await getCustomers(request, {limit})

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('limit must be an integer between 1 and 100')
            })
        }    
  })

  test.describe('Parameter combinations', () => {

    const scenarios = [
        {
            description: 'accepts valid page with no matching results',
            params: {
                size: 'Medium',
                industry: 'Technology',
                page: 10,
                limit: 10
            },
            expected: {
                size: 'Medium',
                industry: 'Technology',
                page: 10,
                limit: 10
            }
        },{
            description: 'filters customers page = 2 industry = Finance ',
            params: {
                industry: 'Finance',
                page: 2
            },
            expected: {
                industry: 'Finance',
                page: 2
            }
        },{
            description: 'filters customers limit = 12  size = Very Large Enterprise',
            params: {
                size: 'Very Large Enterprise',
                limit: 12
            },
            expected: {
                size: 'Very Large Enterprise',
                limit: 12
            }
        },{
            description: 'filters customers page=6  limit = 13  size = Medium ',
            params: {
                size: 'Medium',
                page: 6,
                limit: 13
            },
            expected: {
                size: 'Medium',
                page: 6,
                limit: 13
            }
        }
    ]

    for (const scenario of scenarios) {
        test(scenario.description, async ({ request }) => {
            const response = await getCustomers(
                request,
                scenario.params
            )

            expect(response.status).toBe(200)

            const data = response.data

            if (scenario.expected.page !== undefined) {
                expect(data.page).toBe(scenario.expected.page)
            }

            if (scenario.expected.limit !== undefined) {
                expect(data.limit).toBe(scenario.expected.limit)
            }

            for (const customer of data.customers) {
                if (scenario.expected.size !== undefined) {
                    expect(customer.size).toBe( scenario.expected.size )
                }

                if (scenario.expected.industry !== undefined) {
                    expect(customer.industry).toBe( scenario.expected.industry )
                }
            }
            expect(data.totalReturned).toBe(data.customers.length)
        })
    }
})

    test.describe('Parameter combinations filtering', () => {
        const scenarios = [
            {
                description: 'Industry isolated should return matching customers',
                params: { industry: 'Finance' },
                shouldReturnData: true
            },
            {
                description: 'Size isolated should return matching customers',
                params: { size: 'Very Large Enterprise' },
                shouldReturnData: true
            },
            {
                description: 'Size and industry combined with no matching customers should return empty',
                params: { size: 'Very Large Enterprise', industry: 'Finance' },
                shouldReturnData: false
            }
        ]

        for (const scenario of scenarios) {
            test(scenario.description, async ({ request }) => {
                const response = await getCustomers(request, scenario.params)
                
                // 1. Validação global do status HTTP
                expect(response.status).toBe(200) // Nota: No Playwright, response.status() é uma função

                const data = response.data
                expect(data.totalReturned).toBe(data.customers.length)

                if (scenario.shouldReturnData) {
                    // Cenários 1 e 2: Deve retornar dados e todos devem corresponder ao filtro enviado
                    expect(data.customers.length).toBeGreaterThan(0)

                    for (const customer of data.customers) {
                        if (scenario.params.size) {
                            expect(customer.size).toBe(scenario.params.size)
                        }
                        if (scenario.params.industry) {
                            expect(customer.industry).toBe(scenario.params.industry)
                        }
                    }
                } else {
                    // Cenário 3: Não deve retornar dados, mas deve responder com sucesso (200) sem erro
                    expect(data.customers).toHaveLength(0)
                    
                    // Se a API retornar propriedades de paginação/totais, valide-as aqui:
                    if (data.totalReturned !== undefined) {
                        expect(data.totalReturned).toBe(0)
                    }
                }
            })
        }

        test('Adding a page beyond the last page', async ({ request }) => {
            let page = 1
            let foundCustomers = false
            let foundEmptyPage = false
            const maxSafetyLimit = 50

            while (page <= maxSafetyLimit) {
                const response = await getCustomers(request, {
                    page,
                    limit: 50,
                    industry: 'Retail'
                })

                expect(response.status).toBe(200)

                const data = response.data

                expect(data.page).toBe(page)
                expect(data.limit).toBe(50)
                expect(data.totalReturned).toBe(data.customers.length)

                if (data.customers.length === 0) {
                    foundEmptyPage = true
                    break
                }

                foundCustomers = true

                for (const customer of data.customers) {
                    expect(customer.industry).toBe('Retail')
                }

                page++
            }

            expect(foundCustomers).toBe(true)
            expect(foundEmptyPage).toBe(true)
        })

        test('returns unique IDs and emails across pages', async ({ request }) => {
            let page = 1
            let foundEmptyPage = false
            const maxSafetyLimit = 50
            const allCustomers = []

            while (page <= maxSafetyLimit) {
                const response = await getCustomers(request, {
                    page,
                    limit: 2,
                    industry: 'Technology'
                })

                expect(response.status).toBe(200)

                const data = response.data

                expect(data.page).toBe(page)
                expect(data.limit).toBe(2)
                expect(data.totalReturned).toBe(data.customers.length)

                if (data.customers.length === 0) {
                    foundEmptyPage = true
                    break
                }

                for (const customer of data.customers) {
                    expect(customer.industry).toBe('Technology')
                    allCustomers.push(customer)
                }

                page++
            }

            expect(foundEmptyPage).toBe(true)
            expect(allCustomers.length).toBeGreaterThanOrEqual(2)

            const ids = allCustomers.map(customer => customer.id)
            const emails = allCustomers.map(customer => customer.email)

            expect(new Set(ids).size).toBe(ids.length)
            expect(new Set(emails).size).toBe(emails.length)
        })

        test('Inconsistent data across pages - Unique IDs and Emails', async ({ request }) => {
            let page = 1
            let hasMoreData = true
            const maxSafetyLimit = 3
            const allCustomers = [] // Array para acumular os registros de todas as páginas

            while (hasMoreData && page <= maxSafetyLimit) {
                const response = await getCustomers(request, {
                    page: page,
                    limit: 2,
                    industry: 'Technology'
                })

                expect(response.status).toBe(200) // Lembre-se do parêntese se for método do Playwright
                const data = response.data

                expect(data.page).toBe(page)
                expect(data.limit).toBe(2)
                expect(data.totalReturned).toBe(data.customers.length)

                // Verifica se existem clientes na resposta
                if (data.customers && data.customers.length > 0) {
                    
                    for (const customer of data.customers) {
                        // Validações por item (ajustadas para a estrutura correta do JSON)
                        expect(customer.industry).toBe('Technology')

                        // Salva o id e email no array acumulador
                        allCustomers.push(customer)
                    }

                    // Incrementa a página para a próxima iteração do while
                    page++
                } else {
                    hasMoreData = false // Encontrou a página vazia, encerra o loop
                }
            }

            // --- VALIDAÇÕES FINAIS DE DUPLICIDADE ---
            expect(hasMoreData).toBe(false)
            expect(allCustomers.length).toBeGreaterThanOrEqual(2)

            // Extrai apenas os IDs e Emails para arrays separados
            const ids = allCustomers.map(c => c.id)
            const emails = allCustomers.map(c => c.email)

            // Cria um Set (valores únicos) para comparar com o tamanho original
            const uniqueIds = new Set(ids)
            const uniqueEmails = new Set(emails)

            // Se o tamanho do Set for igual ao tamanho do array, significa que não há duplicadas!
            expect(uniqueIds.size).toBe(ids.length)
            expect(uniqueEmails.size).toBe(emails.length)
        })
    })
})
