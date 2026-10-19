import { createCustomer, putCustomer, deleteCustomer, getCustomers } from '../helpers/customer'
import { getCustomerFromDatabase, getFiltersFromDatabase } from '../helpers/database'

import { test } from '../fixtures/customers.fixture'
import { expect } from '@playwright/test'

test.describe('Validated data returned from the database', () => {

    test('Using size and industry as filters', async ({ request }) => {

        const filters = {
            size: 'Small',
            industry: 'Logistics'
        }

        const response = await getCustomers(request, filters)

        expect(response.status).toBe(200)

        const customerGet = response.data.customers
        const customerDB = await getFiltersFromDatabase(filters)

        expect(customerGet).toHaveLength(customerDB.length)

        for (const customer of customerGet) {
            const customerFromDB = customerDB.find(
                dbCustomer => dbCustomer.id === customer.id
            )

            expect(customerFromDB).toBeDefined()
            expect(customer.name).toBe(customerFromDB.name)
            expect(customer.email).toBe(customerFromDB.email)
            expect(customer.size).toBe(customerFromDB.size)
            expect(customer.industry).toBe(customerFromDB.industry)
        }
    })


    test('Filters customers by size Enterprise and validates database data', async ({ request }) => {

        const filters = { size: 'Enterprise' }
        const limit = 10
        const maxSafetyLimit = 50

        let page = 1
        let foundCustomers = false
        let foundEmptyPage = false

        while (page <= maxSafetyLimit) {

            const response = await getCustomers(request, {
                page,
                limit,
                ...filters
            })

            expect(response.status).toBe(200)

            const customerGet = response.data.customers

            if (customerGet.length === 0) {
                foundEmptyPage = true
                break
            }

            foundCustomers = true

            const offset = (page - 1) * limit

            const customerDB = await getFiltersFromDatabase(
                filters,
                limit,
                offset
            )

            expect(customerGet).toHaveLength(customerDB.length)
            const customerIds = new Set()
            
            for (const customer of customerGet) {

                expect(customer.size).toBe(filters.size)

                const customerFromDB = customerDB.find(
                    dbCustomer => dbCustomer.id === customer.id
                )

                expect(customerIds.has(customer.id)).toBe(false)
                customerIds.add(customer.id)

                expect(customerFromDB).toBeDefined()

                expect(customer.id).toBe(customerFromDB.id)
                expect(customer.name).toBe(customerFromDB.name)
                expect(customer.email).toBe(customerFromDB.email)
                expect(customer.size).toBe(customerFromDB.size)
                expect(customer.industry).toBe(customerFromDB.industry)
            }

            page++
        }

        expect(foundCustomers).toBe(true)
        expect(foundEmptyPage).toBe(true)
    })


    test('Filters customers by industry Logistics and validates database data', async ({ request }) => {

        const filters = { industry: 'Logistics' }
        const limit = 10
        const maxSafetyLimit = 50
        const customerIds = new Set()

        let page = 1
        let foundCustomers = false
        let foundEmptyPage = false

        while (page <= maxSafetyLimit) {

            const response = await getCustomers(request, {
                page,
                limit,
                ...filters
            })

            expect(response.status).toBe(200)

            const customerGet = response.data.customers

            if (customerGet.length === 0) {
                foundEmptyPage = true
                break
            }

            foundCustomers = true

            const offset = (page - 1) * limit

            const customerDB = await getFiltersFromDatabase(
                filters,
                limit,
                offset
            )

            expect(customerGet).toHaveLength(customerDB.length)
                        
            for (const customer of customerGet) {

                expect(customer.industry).toBe(filters.industry)

                const customerFromDB = customerDB.find(
                    dbCustomer => dbCustomer.id === customer.id
                )

                expect(customerIds.has(customer.id)).toBe(false)
                customerIds.add(customer.id)
                
                expect(customerFromDB).toBeDefined()

                expect(customer.id).toBe(customerFromDB.id)
                expect(customer.name).toBe(customerFromDB.name)
                expect(customer.email).toBe(customerFromDB.email)
                expect(customer.size).toBe(customerFromDB.size)
                expect(customer.industry).toBe(customerFromDB.industry)
            }

            page++
        }

        expect(foundCustomers).toBe(true)
        expect(foundEmptyPage).toBe(true)
    })

    test('Filters customers by industry Logistics more size Enterprise and validates database data', async ({ request }) => {

        const filters = { size: 'Enterprise', industry: 'Logistics' }
        const limit = 10
        const maxSafetyLimit = 50
        const customerIds = new Set()

        let page = 1
        let foundCustomers = false
        let foundEmptyPage = false

        while (page <= maxSafetyLimit) {

            const response = await getCustomers(request, {
                page,
                limit,
                ...filters
            })

            expect(response.status).toBe(200)

            const customerGet = response.data.customers

            if (customerGet.length === 0) {
                foundEmptyPage = true
                break
            }

            foundCustomers = true

            const offset = (page - 1) * limit

            const customerDB = await getFiltersFromDatabase(
                filters,
                limit,
                offset
            )

            expect(customerGet).toHaveLength(customerDB.length)
                        
            for (const customer of customerGet) {

                expect(customer.industry).toBe(filters.industry)
                expect(customer.size).toBe(filters.size)

                const customerFromDB = customerDB.find(
                    dbCustomer => dbCustomer.id === customer.id
                )

                expect(customerIds.has(customer.id)).toBe(false)
                customerIds.add(customer.id)
                
                expect(customerFromDB).toBeDefined()

                expect(customer.id).toBe(customerFromDB.id)
                expect(customer.name).toBe(customerFromDB.name)
                expect(customer.email).toBe(customerFromDB.email)
                expect(customer.size).toBe(customerFromDB.size)
                expect(customer.industry).toBe(customerFromDB.industry)
            }

            page++
        }

        expect(foundCustomers).toBe(true)
        expect(foundEmptyPage).toBe(true)
    })    

    test('Not using any filters', async ({ request }) => {

        const limit = 100
        const maxSafetyLimit = 50
        const customerIds = new Set()
        
        let page = 1
        let foundCustomers = false
        let foundEmptyPage = false

        while (page <= maxSafetyLimit) {

            const response = await getCustomers(request, {
                page,
                limit
            })

            expect(response.status).toBe(200)

            const customerGet = response.data.customers

            if (customerGet.length === 0) {
                foundEmptyPage = true
                break
            }

            foundCustomers = true

            const offset = (page - 1) * limit

            const customerDB = await getFiltersFromDatabase(
                {},
                limit,
                offset
            )

            expect(customerGet).toHaveLength(customerDB.length)

            for (const customer of customerGet) {

                const customerFromDB = customerDB.find(
                    dbCustomer => dbCustomer.id === customer.id
                )

                expect(customerIds.has(customer.id)).toBe(false)
                customerIds.add(customer.id)
                
                expect(customerFromDB).toBeDefined()

                expect(customer.id).toBe(customerFromDB.id)
                expect(customer.name).toBe(customerFromDB.name)
                expect(customer.email).toBe(customerFromDB.email)
                expect(customer.size).toBe(customerFromDB.size)
                expect(customer.industry).toBe(customerFromDB.industry)
            }

            page++
        }

        expect(foundCustomers).toBe(true)
        expect(foundEmptyPage).toBe(true)     
    })

})

    test('Returns no customers when filters have no matching records', async ({ request }) => {

        const filters = {
            size: 'Very Large Enterprise',
            industry: 'Finance'
        }

        const response = await getCustomers(request, {
            page: 1,
            limit: 10,
            ...filters
        })

        expect(response.status).toBe(200)

        const customerGet = response.data.customers

        const customerDB = await getFiltersFromDatabase(
            filters,
            10,
            0
        )

        expect(customerDB).toHaveLength(0)
        expect(customerGet).toHaveLength(0)
        expect(response.data.totalReturned).toBe(0)
    })  

test('persists created customer in database', async ({ request }) => {

    const name = `Playwright Customer ${Date.now()}`
    const email = `playwright-${Date.now()}@demo.com`

    const response = await createCustomer(request, {
        name,
        email,
        size: 'Medium',
        industry: 'Technology'
    })

    expect(response.status).toBe(201)

    const customerId = response.data.id

    try {

        const customer = await getCustomerFromDatabase(customerId)

        expect(customer.id).toBe(customerId)
        expect(customer.name).toBe(name)
        expect(customer.email).toBe(email)
        expect(customer.size).toBe('Medium')
        expect(customer.industry).toBe('Technology')

    } finally {
        const cleanup = await deleteCustomer( request, customerId )

        expect(cleanup.status()).toBe(204)
    }
})

test('persists updated customer in database', async ({ request, customer }) => {

    const updatedName = `Updated Customer ${Date.now()}`
    const updatedEmail = `updated-${Date.now()}@demo.com`

    const response = await putCustomer(request, customer.id, {
        name: updatedName,
        email: updatedEmail,
        size: 'Enterprise',
        industry: 'Finance'
    })

    expect(response.status).toBe(200)

    const databaseCustomer = await getCustomerFromDatabase(customer.id)

    expect(databaseCustomer.id).toBe(customer.id)
    expect(databaseCustomer.name).toBe(updatedName)
    expect(databaseCustomer.email).toBe(updatedEmail)
    expect(databaseCustomer.size).toBe('Enterprise')
    expect(databaseCustomer.industry).toBe('Finance')
})

test('removes customer from database', async ({ request, customer }) => {

    const response = await deleteCustomer(request, customer.id)

    expect(response.status()).toBe(204)

    const databaseCustomer = await getCustomerFromDatabase(customer.id)

    expect(databaseCustomer).toBeUndefined()
})