import mongoModel from "../models/mongo-model";
import chance from "./chance";
import pgDatabaseClient from "./pg-database-client";
import format from 'pg-format';

async function seedMongo(documents: Record<string, any>[]) {
  console.log('Seeding mongo.');
  await mongoModel.deleteMany({});
  await mongoModel.insertMany(documents);
}

async function seedPG(documents: Record<string, any>[]) {
  console.log('Seeding postgresql.');
  const values = documents.map(document => Object.keys(document)
    .map(function(key) {
        return document[key];
    }));

  await pgDatabaseClient.query(`DELETE FROM "Members"`)

  const sql = format(`INSERT INTO "Members" ("firstName", "lastName", "age", "gender", "birthdate") 
    VALUES %L`, values);

  await pgDatabaseClient.query(sql)
}


export default async function (records: number) {
  let documents = [];

  if (records <= 0) {
    throw new Error('Records must be greater than 0')
  }

  for (let i = 0; i < records; i++) {
    const name = chance.name().split(' ');
    documents.push({
      firstName: name[0],
      lastName: name[1],
      age: chance.age(),
      gender: chance.gender(),
      birthdate: new Date(chance.birthday())
    })
  }

  await seedMongo(documents);
  await seedPG(documents)

  console.log(`Inserted ${records} documents`);
  return;
}