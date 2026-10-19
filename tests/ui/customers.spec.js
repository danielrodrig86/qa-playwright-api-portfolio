const { test, expect } = require('@playwright/test')
import { deleteCustomer, getCustomer } from '../helpers/customer'
import { randomUUID } from 'node:crypto'

test.describe('Home page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })
 
  test.describe('Customer Management UI', () => {

      test('displays the customer list', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Customer Management' })).toBeVisible()
        await expect(page.locator('tbody tr').first()).toBeVisible()
      })
  })






  test.describe('Filtering by industry only', () => {
        const filtersIndustry = [
            {
                description: 'Logistics',
                industry: 'Logistics'
            },
            {
                description: 'Retail',
                industry: 'Retail'
            },
            {
                description: 'Technology',
                industry: 'Technology'
            },
            {
                description: 'HR',
                industry: 'HR'
            },
            {
                description: 'Finance',
                industry: 'Finance'
            }]

        for (const customer of filtersIndustry) {
            test(`filters customers by industry ${customer.description}`, async ({ page }) => {
         await page.selectOption('#industry', customer.industry)
 
          const responsePromise = page.waitForResponse(response => {
              const url = new URL(response.url())

              return url.pathname.endsWith('/customers') &&
                  url.searchParams.get('industry') === customer.industry &&
                  response.status() === 200
          })

          await page.getByRole('button', { name: 'Filter' }).click()

          const response = await responsePromise
          const data = await response.json()

          const rows = page.locator('tbody tr:visible')

          await expect(rows).toHaveCount(data.customers.length)

          for (let i = 0; i < data.customers.length; i++) {
              await expect(rows.nth(i).locator('td').nth(4))
                  .toHaveText(customer.industry)
          }
            })
        } 
    })






  test.describe('Filtering by size only', () => {
        const filtersSize = [
            {
                description: 'Small',
                size: 'Small'
            },
            {
                description: 'Medium',
                size: 'Medium'
            },
            {
                description: 'Enterprise',
                size: 'Enterprise'
            },
            {
                description: 'Large Enterprise',
                size: 'Large Enterprise'
            },
            {
                description: 'Very Large Enterprise',
                size: 'Very Large Enterprise'
            }]

        for (const customer of filtersSize) {
            test(`filters customers by size ${customer.description}`, async ({ page }) => {
         await page.selectOption('#size', customer.size)
 
          const responsePromise = page.waitForResponse(response => {
              const url = new URL(response.url())

              return url.pathname.endsWith('/customers') &&
                  url.searchParams.get('size') === customer.size &&
                  response.status() === 200
          })

          await page.getByRole('button', { name: 'Filter' }).click()

          const response = await responsePromise
          const data = await response.json()

          const rows = page.locator('tbody tr:visible')

          await expect(rows).toHaveCount(data.customers.length)

          for (let i = 0; i < data.customers.length; i++) {
              await expect(rows.nth(i).locator('td').nth(3))
                  .toHaveText(customer.size)
          }
            })
        } 
    })






  test.describe('Filtering by size and industry', () => {
        const Sizes = [
                'Small',
                'Medium',
                'Enterprise',
                'Large Enterprise',
                'Very Large Enterprise'
            ]

        const Industrys = [
                'Logistics',
                'Retail',
                'Technology',
                'HR',
                'Finance'
            ]

        for (const customerS of Sizes) {

            for (const customerI of Industrys){
                test(`filters customers by size ${customerS} and industry ${customerI}`, async ({ page }) => {
                    await page.selectOption('#size', customerS)
                    await page.selectOption('#industry', customerI)

                    const responsePromise = page.waitForResponse(response => {
                        const url = new URL(response.url())

                        return url.pathname.endsWith('/customers') &&
                            url.searchParams.get('size') === customerS &&
                            url.searchParams.get('industry') === customerI &&
                            response.status() === 200
                    })

                    await page.getByRole('button', { name: 'Filter' }).click()

                    const response = await responsePromise
                    const data = await response.json()

                    const rows = page.locator('tbody tr:visible')

                    await expect(rows).toHaveCount(data.customers.length)

                    for (let i = 0; i < data.customers.length; i++) {
                        await expect(rows.nth(i).locator('td').nth(3))
                            .toHaveText(customerS)
                        await expect(rows.nth(i).locator('td').nth(4))
                            .toHaveText(customerI)                    
                    }
                    })
            }

        } 
    })






  test.describe('Creating a client', () => {

      test('fills the customer form', async ({ page }) => {
        const uniqueId = randomUUID()
        const email = `ui-${uniqueId}@demo.com`

        await page.locator('#name').fill('Playwright Customer')
        await page.locator('#email').fill(email)
        await page.selectOption('#customer-size', 'Small')
        await page.selectOption('#customer-industry', 'Retail')

        await expect(page.locator('#name')).toHaveValue('Playwright Customer') 
        await expect(page.locator('#email')).toHaveValue(email) 
        await expect(page.locator('#customer-size')).toHaveValue('Small')
        await expect(page.locator('#customer-industry')).toHaveValue('Retail')
      })

      test('creates a new customer', async ({ request, page }) => {
        const uniqueId = randomUUID()
        const email = `ui-${uniqueId}@demo.com`
        let customer

        try {
            await page.locator('#name').fill('UI Automated Customer')
            await page.locator('#email').fill(email)
            await page.selectOption('#customer-size', 'Small')
            await page.selectOption('#customer-industry', 'Retail')

            const responsePromise = page.waitForResponse(response => response.url().includes('/customers') && response.request().method() === 'POST')

            await page.getByRole('button', { name: 'Create customer' }).click()
            await expect(page.locator('#message')).toHaveText('Customer created successfully')            
            
            const response = await responsePromise
            customer = await response.json()

        } finally {

            const cleanup = await deleteCustomer( request, customer.id )
            expect([204, 404]).toContain(cleanup.status())
            
        }
      })

      test('validate response by created client', async ({ request, page }) => {
        const uniqueId = randomUUID()
        const email = `ui-${uniqueId}@demo.com`
        let data

      try{

        await page.locator('#name').fill('Playwright Customer')
        await page.locator('#email').fill(email)
        await page.selectOption('#customer-size', 'Small')
        await page.selectOption('#customer-industry', 'Retail')

        const responsePromise = page.waitForResponse(response => response.url().includes('/customers') && response.request().method() === 'POST')

        await page.getByRole('button', { name: 'Create customer' }).click()

        const response = await responsePromise
        data = await response.json()

        expect(response.status()).toBe(201)
        expect(data.id).toBeDefined()
        expect(data.name).toBe('Playwright Customer')
        expect(data.email).toBe(email)
        expect(data.size).toBe('Small')
        expect(data.industry).toBe('Retail')
        
        } finally {

            const cleanup = await deleteCustomer( request, data.id )
            expect([204, 404]).toContain(cleanup.status())
            
        }
      })

      test('validates created customer by ID', async ({ request, page }) => {
        const uniqueId = randomUUID()
        const email = `ui-${uniqueId}@demo.com`
        let customerId

        try {

        await page.locator('#name').fill('Playwright Customer')
        await page.locator('#email').fill(email)
        await page.selectOption('#customer-size', 'Small')
        await page.selectOption('#customer-industry', 'Retail')

        const responsePromise = page.waitForResponse(response => response.url().includes('/customers') && response.request().method() === 'POST')

        await page.getByRole('button', { name: 'Create customer' }).click()

        const response = await responsePromise
        const data = await response.json()
        customerId = data.id

        const getResponse = await getCustomer(request,customerId)

        expect(getResponse.status).toBe(200)

        const customer = getResponse.data

        expect(customer.id).toBe(customerId)
        expect(customer.name).toBe('Playwright Customer')
        expect(customer.email).toBe(email)
        expect(customer.size).toBe('Small')
        expect(customer.industry).toBe('Retail')  

        } finally {

            const cleanup = await deleteCustomer( request, customerId )
            expect([204, 404]).toContain(cleanup.status())
            
        }
      })
    })
})