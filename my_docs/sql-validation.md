# SQL Validation

Examples for validating API results directly in PostgreSQL.

## Count customers

```sql
SELECT COUNT(*)
FROM customers;
```

## Validate Medium customers

```sql
SELECT id, name, email, size, industry
FROM customers
WHERE size = 'Medium'
ORDER BY id;
```

## Validate Technology customers

```sql
SELECT id, name, email, size, industry
FROM customers
WHERE industry = 'Technology'
ORDER BY id;
```

## Validate combined filter

```sql
SELECT id, name, email, size, industry
FROM customers
WHERE size = 'Medium'
  AND industry = 'Technology'
ORDER BY id;
```

## Find duplicated emails

```sql
SELECT email, COUNT(*)
FROM customers
GROUP BY email
HAVING COUNT(*) > 1;
```

## QA use

The goal is to compare:

API response
→ expected business rule
→ database state

This demonstrates backend validation rather than testing only the UI.
