import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    host: 'localhost',
    port: 5433,
    user: 'qa_user',
    password: 'qa_password',
    database: 'qa_portfolio'
})

export async function queryDatabase(query, values = []) {
    const result = await pool.query(query, values)

    return result.rows
}

export async function getFiltersFromDatabase(filters = {},limit, offset) {
    const { name, email, size, industry } = filters

    let query = 'SELECT * FROM customers WHERE 1=1'
    const values = []
    let paramIndex = 1

    if (name) {
        query += ` AND name ILIKE $${paramIndex}`
        values.push(`%${name}%`)
        paramIndex++
    }

    if (email) {
        query += ` AND email ILIKE $${paramIndex}`
        values.push(`%${email}%`)
        paramIndex++
    }

    if (size) {
        query += ` AND size = $${paramIndex}`
        values.push(size)
        paramIndex++
    }

    if (industry) {
        query += ` AND industry = $${paramIndex}`
        values.push(industry)
        paramIndex++
    }

    query += ' ORDER BY id ASC'

    if (limit !== undefined && limit !== null) {
        query += ` LIMIT $${paramIndex}`
        values.push(limit)
        paramIndex++
    }

    if (offset !== undefined && offset !== null) {
        query += ` OFFSET $${paramIndex}`
        values.push(offset)
        paramIndex++
    }

    //console.log('Filtros recebidos:', filters)
    //console.log('Query montada:', query)
    //console.log('Valores dos parâmetros:', values)

    const result = await queryDatabase(query, values)

    //console.log('Resultado do banco:', result)
    //console.log('Quantidade no banco:', result.length)

    return result
}


export async function getCustomerFromDatabase(customerId) {
    const result = await queryDatabase(
        'SELECT * FROM customers WHERE id = $1',
        [customerId]
    )

    return result[0]
}