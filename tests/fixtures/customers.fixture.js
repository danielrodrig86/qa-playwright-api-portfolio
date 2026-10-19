import { test as base } from '@playwright/test'
import { createCustomer, deleteCustomer } from '../helpers/customer'

export const test = base.extend({
    customer: async ({ request }, use) => {
        const response = await createCustomer(request)

        await use(response.data)

        const cleanupResponse = await deleteCustomer(request, response.data.id)

        if (cleanupResponse.status() !== 204 && cleanupResponse.status() !== 404) {
            throw new Error(`Failed to cleanup customer ${response.data.id}`)
        }
}})