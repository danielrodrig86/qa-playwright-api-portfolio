import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'
import { deleteCustomer, getCustomer, createCustomer } from '../helpers/customer'


test.describe('DELETE /customers/ID', () => {

    test.describe('Delete', () => {

    test('delete a customer', async ({ request,customer }) => {
      const responseGet = await getCustomer(request,customer.id)
      expect(responseGet.status).toBe(200)

      const response2 = await deleteCustomer(request,customer.id)
      expect(response2.status()).toBe(204)

      const bodyText = await response2.text();
      expect(bodyText).toBe('')

      const getResponse = await getCustomer(request,customer.id)
      expect(getResponse.status).toBe(404)
    })
  })

  test.describe('Invalid ID', () => {

    const invalidIds = [
        { description: 'text ID', id: 'abc' },
        { description: 'zero ID', id: '0' },
        { description: 'negative ID', id: '-1' },
        { description: 'decimal ID', id: '1.5' }
    ]

    for (const testCase of invalidIds) {
        test(`rejects ${testCase.description}`, async ({ request }) => {
            const response = await deleteCustomer(request, testCase.id)

            expect(response.status()).toBe(400)

            const { error } = await response.json()
            expect(error).toBe('id must be a positive integer')
        })
    }
})
  
  test.describe('non-existent resource', () => {

    test('returns 404 for a non-existent customer', async ({ request,customer }) => {
      const responseDelete = await deleteCustomer(request,customer.id)
      expect(responseDelete.status()).toBe(204)

      const response = await deleteCustomer(request,customer.id)
      const { error } = await response.json()

      expect(response.status()).toBe(404)
      expect(error).toBe('customer not found')
    }) 

    test('does not delete other customers', async ({ request, customer }) => {
        const otherCustomer = await createCustomer(request)
        expect(otherCustomer.status).toBe(201)

        try {
            const deleted = await deleteCustomer(request, customer.id)
            expect(deleted.status()).toBe(204)

            const deletedCustomer = await getCustomer(request, customer.id)
            expect(deletedCustomer.status).toBe(404)

            const remainingCustomer = await getCustomer( request, otherCustomer.data.id )

            expect(remainingCustomer.status).toBe(200)
            expect(remainingCustomer.data.id).toBe(otherCustomer.data.id)

        } finally {

            const cleanup = await deleteCustomer( request, otherCustomer.data.id )
            expect([204, 404]).toContain(cleanup.status())
            
        }
    })
  })
})
