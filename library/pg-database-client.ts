import { Client } from 'pg';

export default new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "password",
  database: "postgres"
})
