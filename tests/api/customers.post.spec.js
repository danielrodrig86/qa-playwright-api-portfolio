import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'
import { createCustomer, deleteCustomer } from '../helpers/customer'

test.describe('POST /customers', () => {
  
  test.describe('creation', () => {

      test('creates a customer', async ({ request }) => {

        const uniqueName = `Playwright Customer ${Date.now()}`
        const uniqueEmail = `playwright-${Date.now()}@demo.com`

        const response = await createCustomer(request,{ name: uniqueName, email: uniqueEmail})  
        expect(response.status).toBe(201)

        try {

        expect(response.data.id).toEqual(expect.any(Number))
        expect(response.data.name).toBe(uniqueName)
        expect(response.data.email).toBe(uniqueEmail)
        expect(response.data.size).toBe('Medium')
        expect(response.data.industry).toBe('Technology')

    } finally {
            if (response.data?.id !== undefined) {
                const cleanup = await deleteCustomer( request, response.data.id )

                expect(cleanup.status()).toBe(204)
            }
        }
      })

      test('validates created customer response structure', async ({ request }) => {

        const customer = await createCustomer(request)
        expect(customer.status).toBe(201)

        try {

        expect(customer.data).toHaveProperty('id')
        expect(customer.data).toHaveProperty('name')
        expect(customer.data).toHaveProperty('email')
        expect(customer.data).toHaveProperty('size')
        expect(customer.data).toHaveProperty('industry')
        expect(customer.data).toHaveProperty('created_at')

        expect(customer.data.id).toEqual(expect.any(Number))
        expect(customer.data.name).toEqual(expect.any(String))
        expect(customer.data.email).toEqual(expect.any(String))
        expect(customer.data.size).toEqual(expect.any(String))
        expect([
            'Small',
            'Medium',
            'Enterprise',
            'Large Enterprise',
            'Very Large Enterprise'
        ]).toContain(customer.data.size)
        expect(customer.data.industry).toEqual(expect.any(String))
        expect([
            'Logistics',
            'Retail',
            'Technology',
            'HR',
            'Finance'
        ]).toContain(customer.data.industry)
        expect(customer.data.created_at).toEqual(expect.any(String))
        expect(Number.isNaN(Date.parse(customer.data.created_at))).toBe(false)  

        } finally {
            if (customer.data?.id !== undefined) {
                const cleanup = await deleteCustomer( request, customer.data.id )

                expect(cleanup.status()).toBe(204)
        }
        }
    })
  })

    test.describe('Required fields', () => {
        const requiredFieldsCustomers = [
            { description: 'without name',
                field: 'name' },

            { description: 'without email',
                field: 'email' },

            { description: 'without size',
                field: 'size' },

            { description: 'without industry',
                field: 'industry' }
            ]

        for (const customerCase of requiredFieldsCustomers) {
            test(`rejects ${customerCase.description}`, async ({ request }) => {
                const response = await createCustomer(
                                request, {}, { omitFields: [customerCase.field] 
                })

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('name, email, size and industry are required and cannot be empty' )
            })
        }
    })

    test.describe('Empty values', () => {

        const emptyValues = [

            { description: 'empty name',
                name: '' },

            { description: 'empty email',
                email: '' },

            { description: 'whitespace-only name',
                name: '      '},

            { description: 'whitespace-only email',
                email: '      '
            }]
        
        for (const customerCase of emptyValues) {
            test(`rejects ${customerCase.description}`, async ({ request }) => {
                const response = await createCustomer(
                                request, {
                                    name: customerCase.name,
                                    email: customerCase.email }, {})

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('name, email, size and industry are required and cannot be empty' )
            })
        }
    })

    test.describe('Invalid values', () => {
        const invalidCustomers = [
            {
                description: 'invalid size',
                size: 'Invalid Size',
                industry: 'Technology'
            },
            {
                description: 'invalid industry',
                size: 'Medium',
                industry: 'Invalid Industry'
            }]

        for (const customer of invalidCustomers) {
            test(`rejects ${customer.description}`, async ({ request }) => {

                const response = await createCustomer(request, {
                    size: customer.size,
                    industry: customer.industry
                })

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('invalid size or industry')
            })
        }   
  })

  test.describe('Email validation', () => {

      test('invalid email format', async ({ request }) => {
        const customer1 = await createCustomer(request, {email: 'teste'})
        expect(customer1.status).toBe(400)
        expect(customer1.data.error).toBe('invalid email format')
      })  

      test('rejects duplicate email', async ({ request }) => {
        const customer1 = await createCustomer(request)
        expect(customer1.status).toBe(201)

        try {
        const response = await createCustomer(request, {
            email: customer1.data.email})

        expect(response.status).toBe(409)
        expect(response.data.error).toBe('email already exists')
    } finally {
        const cleanup = await deleteCustomer( request, customer1.data.id )

        expect(cleanup.status()).toBe(204)
    }
})  
  })

  test.describe('IDs', () => {

      test('creates customers with different IDs', async ({ request }) => {
        const customer1 = await createCustomer(request )
        expect(customer1.status).toBe(201)
        
        const customer2 = await createCustomer(request )  
        expect(customer2.status).toBe(201)

        try {

            expect(customer1.data.id).toEqual(expect.any(Number))
            expect(customer2.data.id).toEqual(expect.any(Number))

            expect(customer2.data.id).not.toBe(customer1.data.id)

        } finally {

            if (customer1.data?.id !== undefined) {

                const cleanup = await deleteCustomer( request, customer1.data.id )
                expect(cleanup.status()).toBe(204)
            }

            if (customer2.data?.id !== undefined) {
                const cleanup2 = await deleteCustomer( request, customer2.data.id )
                expect(cleanup2.status()).toBe(204)
            }
        }
      })
  })
})
