import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'
import { getCustomer, createCustomer, putCustomer, deleteCustomer } from '../helpers/customer'


test.describe('CRUD /customers', () => {
    test.describe('complete workflow', () => {

      test('complete crud', async ({ request }) => {
          const postResponse = await createCustomer(request)
          const getResponse = await getCustomer(request,postResponse.data.id)
          expect(getResponse.status).toBe(200)

          expect(getResponse.data.id).toBe(postResponse.data.id)
          expect(getResponse.data.name).toBe(postResponse.data.name)
          expect(getResponse.data.email).toBe(postResponse.data.email)
          expect(getResponse.data.size).toBe(postResponse.data.size)
          expect(getResponse.data.industry).toBe(postResponse.data.industry)

          const putResponse = await putCustomer(request,postResponse.data.id)
          expect(putResponse.id).toBe(postResponse.id)

          const getResponse2 = await getCustomer(request,postResponse.data.id)
          expect(getResponse2.status).toBe(200)
          expect(getResponse2.data.id).toBe(putResponse.data.id)
          expect(getResponse2.data.name).toBe(putResponse.data.name)
          expect(getResponse2.data.email).toBe(putResponse.data.email)
          expect(getResponse2.data.size).toBe(putResponse.data.size)
          expect(getResponse2.data.industry).toBe(putResponse.data.industry)

          const deleteResponse = await deleteCustomer(request,putResponse.data.id)
          expect(deleteResponse.status()).toBe(204)
          const bodyText = await deleteResponse.text();
          expect(bodyText).toBe('')

          const getResponse3 = await getCustomer(request,putResponse.data.id)
          expect(getResponse3.status).toBe(404)
          expect(getResponse3.data.error).toBe('customer not found')
          })     
    })
})