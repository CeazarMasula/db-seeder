# db-seeder

### Seeder to add mock rows for PostgreSQL and Mongo

### Setup postgre schema
#### `PGPASSWORD=password psql --host=localhost --username=postgres -a -f models/schema.sql`

### Seeding both DBs
#### - Run command - `docker-compose up -d`
#### - Update the number of rows to be added on line 13 of index.ts
#### - Run `npm start`
