const express = require('express')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const yaml = require('fs').readFileSync(path.join(__dirname, '..', 'openapi', 'openapi.yaml'), 'utf8')
const pool = require('./db')

const app = express()
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

const sizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise']
const industries = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance']

// Regex para validação de formato de e-mail no back-end
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.status(200).json({ status: 'ok', database: 'connected' })
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' })
  }
})

app.get('/customers', async (req, res) => {
  const page = req.query.page === undefined ? 1 : Number(req.query.page)
  const limit = req.query.limit === undefined ? 10 : Number(req.query.limit)
  const size = req.query.size
  const industry = req.query.industry

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: 'page must be an integer greater than or equal to 1' })
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return res.status(400).json({ error: 'limit must be an integer between 1 and 100' })
  }

  if (size && !sizes.includes(size)) {
    return res.status(400).json({ error: `size must be one of: ${sizes.join(', ')}` })
  }

  if (industry && !industries.includes(industry)) {
    return res.status(400).json({ error: `industry must be one of: ${industries.join(', ')}` })
  }

  const values = []
  const conditions = []

  if (size) {
    values.push(size)
    conditions.push(`size = $${values.length}`)
  }

  if (industry) {
    values.push(industry)
    conditions.push(`industry = $${values.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const offset = (page - 1) * limit

  values.push(limit)
  values.push(offset)

  const query = `
    SELECT id, name, email, size, industry, created_at
    FROM customers
    ${where}
    ORDER BY id
    LIMIT $${values.length - 1}
    OFFSET $${values.length}
  `

  try {
    const result = await pool.query(query, values)
    res.status(200).json({
      page,
      limit,
      totalReturned: result.rows.length,
      customers: result.rows
    })
  } catch {
    res.status(500).json({ error: 'internal server error' })
  }
})

app.get('/customers/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id must be a positive integer' })
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, size, industry, created_at FROM customers WHERE id = $1',
      [id]
    )

    if (!result.rows.length) {
      return res.status(404).json({ error: 'customer not found' })
    }

    res.status(200).json(result.rows[0])
  } catch {
    res.status(500).json({ error: 'internal server error' })
  }
})

app.post('/customers', async (req, res) => {
  const { name, email, size, industry } = req.body

  // 1. Verifica se os campos existem e se não estão vazios ou apenas com espaços
  if (
    !name || typeof name !== 'string' || !name.trim() ||
    !email || typeof email !== 'string' || !email.trim() ||
    !size || typeof size !== 'string' || !size.trim() ||
    !industry || typeof industry !== 'string' || !industry.trim()
  ) {
    return res.status(400).json({ error: 'name, email, size and industry are required and cannot be empty' })
  }

  // 2. Limpa os espaços extras das pontas antes de validar e salvar
  const cleanName = name.trim()
  const cleanEmail = email.trim()
  const cleanSize = size.trim()
  const cleanIndustry = industry.trim()

  // 3. Validação dos valores permitidos de size e industry
  if (!sizes.includes(cleanSize) || !industries.includes(cleanIndustry)) {
    return res.status(400).json({ error: 'invalid size or industry' })
  }

  // 4. Validação do formato do e-mail
  if (!emailRegex.test(cleanEmail)) {
    return res.status(400).json({ error: 'invalid email format' })
  }

  try {
    // 5. Inserção no banco utilizando os dados limpos (sem espaços extras)
    const result = await pool.query(
      `INSERT INTO customers (name, email, size, industry)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, size, industry, created_at`,
      [cleanName, cleanEmail, cleanSize, cleanIndustry]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'email already exists' })
    }
    res.status(500).json({ error: 'internal server error' })
  }
})

app.put('/customers/:id', async (req, res) => {
  const id = Number(req.params.id)
  const { name, email, size, industry } = req.body

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id must be a positive integer' })
  }

  // Remove espaços extras e verifica se os campos estão vazios ou contêm apenas espaços
  const trimmedName = typeof name === 'string' ? name.trim() : ''
  const trimmedEmail = typeof email === 'string' ? email.trim() : ''
  const trimmedSize = typeof size === 'string' ? size.trim() : ''
  const trimmedIndustry = typeof industry === 'string' ? industry.trim() : ''

  if (!trimmedName || !trimmedEmail || !trimmedSize || !trimmedIndustry) {
    return res.status(400).json({ error: 'name, email, size and industry are required' })
  }

  // Validação do formato do e-mail utilizando a regex do arquivo
  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'invalid email format' })
  }

  // Validação dos tamanhos e indústrias permitidos
  if (!sizes.includes(trimmedSize) || !industries.includes(trimmedIndustry)) {
    return res.status(400).json({ error: 'invalid size or industry' })
  }

  try {
    const result = await pool.query(
      `UPDATE customers
       SET name = $1, email = $2, size = $3, industry = $4
       WHERE id = $5
       RETURNING id, name, email, size, industry, created_at`,
      [trimmedName, trimmedEmail, trimmedSize, trimmedIndustry, id]
    )

    if (!result.rows.length) {
      return res.status(404).json({ error: 'customer not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'email already exists' })
    }
    res.status(500).json({ error: 'internal server error' })
  }
})

app.delete('/customers/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: 'id must be a positive integer' })
  }

  try {
    const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING id', [id])

    if (!result.rows.length) {
      return res.status(404).json({ error: 'customer not found' })
    }

    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'internal server error' })
  }
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('yaml').parse(yaml)))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`QA Portfolio running on http://localhost:${PORT}`)
})
