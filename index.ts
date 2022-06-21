import seeder from './library/seeder'
import mongoose from "mongoose";
import config from './library/config'
import pgDatabaseClient from './library/pg-database-client';

async function main() {
  console.log('Starting Mongo Client..');
  mongoose.connect(config.connectionString)

  console.log('Starting Postgresql Client..');
  pgDatabaseClient.connect();

  await seeder(50)

  console.log('Stopping DBs..');
  mongoose.disconnect()
  pgDatabaseClient.end();
}

main();