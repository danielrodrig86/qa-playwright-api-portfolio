import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'
import { putCustomer, deleteCustomer, createCustomer } from '../helpers/customer'


test.describe('PUT /customers/ID', () => {

    test.describe('update', () => {

      test('update a customer', async ({ request, customer }) => {

          const timestamp = Date.now()
          const updatedName = `Update Customer ${timestamp}`
          const updatedEmail = `update-${timestamp}@demo.com`
          const updatedCustomer = await putCustomer(request, customer.id, {name: updatedName, email: updatedEmail, size: 'Small', industry: 'Finance'})
          expect(updatedCustomer.status).toBe(200)

          expect(updatedCustomer.data.id).toBe(customer.id)
          expect(updatedCustomer.data.name).toBe(updatedName)
          expect(updatedCustomer.data.email).toBe(updatedEmail)
          expect(updatedCustomer.data.size).toBe('Small')
          expect(updatedCustomer.data.industry).toBe('Finance')

        })

      test('validates updated customer response structure', async ({ request, customer }) => {

        const customerUp = await putCustomer(request,customer.id)
        expect(customerUp.status).toBe(200)

        expect(customerUp.data).toHaveProperty('id')
        expect(customerUp.data).toHaveProperty('name')
        expect(customerUp.data).toHaveProperty('email')
        expect(customerUp.data).toHaveProperty('size')
        expect(customerUp.data).toHaveProperty('industry')
        expect(customerUp.data).toHaveProperty('created_at')

        expect(customerUp.data.id).toEqual(expect.any(Number))
        expect(customerUp.data.name).toEqual(expect.any(String))
        expect(customerUp.data.email).toEqual(expect.any(String))
        expect(customerUp.data.size).toEqual(expect.any(String))
        expect([
            'Small',
            'Medium',
            'Enterprise',
            'Large Enterprise',
            'Very Large Enterprise'
        ]).toContain(customerUp.data.size)
        expect(customerUp.data.industry).toEqual(expect.any(String))
        expect([
            'Logistics',
            'Retail',
            'Technology',
            'HR',
            'Finance'
        ]).toContain(customerUp.data.industry)
        expect(customerUp.data.created_at).toEqual(expect.any(String))
        expect(Number.isNaN(Date.parse(customerUp.data.created_at))).toBe(false)  

        })
    })

  test.describe('required fields', () => {
        const requiredFieldsCustomers = [
          
            {     description: 'without name',
                  field: 'name' },

            {     description: 'without email',
                  field: 'email' },

            {     description: 'without size',
                  field: 'size' },

            {     description: 'without industry',
                  field: 'industry' 
            }]

        for (const customerCase of requiredFieldsCustomers) {
            test(`rejects ${customerCase.description}`, async ({ request, customer }) => {
                const response = await putCustomer( 
                    request, customer.id, {}, { omitFields: [customerCase.field] 
                })
                expect(response.status).toBe(400)
                expect(response.data.error).toBe('name, email, size and industry are required')
            })
        }
  })

  test.describe('Empty values', () => {
        const emptyValues = [
            {
                description: 'empty name',
                field: 'name',
                value: ''
            },
            {
                description: 'empty email',
                field: 'email',
                value: ''
            },
            {
                description: 'whitespace-only name',
                field: 'name',
                value: '    '
            },
            {
                description: 'whitespace-only email',
                field: 'email',
                value: '    '
            }
        ]

        for (const customerCase of emptyValues) {
            test(`rejects ${customerCase.description}`, async ({ request, customer }) => {
                const response = await putCustomer(
                    request,
                    customer.id,
                    {
                        [customerCase.field]: customerCase.value
                    }
                )

                expect(response.status).toBe(400)
                expect(response.data.error).toBe(
                    'name, email, size and industry are required'
                )
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
        for (const customers of invalidCustomers) {
            test(`rejects ${customers.description}`, async ({ request, customer }) => {

                const response = await putCustomer(request,customer.id, {
                    size: customers.size,
                    industry: customers.industry
                }, {})

                expect(response.status).toBe(400)
                expect(response.data.error).toBe('invalid size or industry')
            })
        }
    })

    test.describe('Email validation', () => {

        test('invalid email format', async ({ request, customer }) => {
            const customer1 = await putCustomer(request, customer.id, {email: 'teste'})
            expect(customer1.status).toBe(400)
            expect(customer1.data.error).toBe('invalid email format')
        }) 
        
        test('rejects duplicate email', async ({ request, customer }) => {

        const response = await createCustomer(request)
        expect(response.status).toBe(201)

        try {
        const customer1 = await putCustomer(request, response.data.id, { email: customer.email })

        expect(customer1.status).toBe(409)
        expect(customer1.data.error).toBe('email already exists')

        } finally {
            const cleanup = await deleteCustomer( request, response.data.id )

            expect(cleanup.status()).toBe(204)
        }
        })
    })

    test.describe('ID validation', () => {

    test('keeps the same ID after update', async ({ request, customer }) => {
        const updatedCustomer = await putCustomer(request,customer.id)
        expect(updatedCustomer.status).toBe(200)
        expect(updatedCustomer.data.id).toBe(customer.id)

      })

    test('returns 404 for a nonexistent customer ID', async ({ request,customer }) => {

        const responseDelete = await deleteCustomer(request,customer.id)
        expect(responseDelete.status()).toBe(204)
        
        const response = await putCustomer(request,customer.id)
        expect(response.status).toBe(404)
        expect(response.data.error).toBe('customer not found')

        })  
        
    test('invalid id', async ({ request }) => {

        const response = await putCustomer(request,'abc')

        expect(response.status).toBe(400)
        expect(response.data.error).toBe('id must be a positive integer')
    })  
  })  
})