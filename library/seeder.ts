import mongoModel from "../models/mongo-model";
import chance from "./chance";
import pgDatabaseClient from "./pg-database-client";
import format from 'pg-format';
import R from 'ramda';

async function seedMongo(documents: Record<string, any>[]) {
  await mongoModel.insertMany(documents);
}

async function seedPG(documents: Record<string, any>[]) {
  const values = documents.map(document => Object.keys(document)
    .map(function(key) {
        return document[key];
    }));


  const sql = format(`INSERT INTO "Members" ("firstName", "lastName", "age", "gender", "birthdate") 
    VALUES %L`, values);

  await pgDatabaseClient.query(sql)
}

export default async function (records: number) {
  let documents = [];
  const batchSize = 5_000;
  let i = 1;
  let startIndex = 0;
  let endIndex = batchSize;
  let progress = 0;

  const twirlTimer = (function() {
    const P = ["\\", "|", "/", "-"];
    let x = 0;
    return setInterval(function() {
      process.stdout.write(`\r ${P[x++]} Seeding... (${progress}%)`);
      x &= 3;
    }, 500);
  })();

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

  await mongoModel.deleteMany({});
  await pgDatabaseClient.query(`DELETE FROM "Members"`)

  if (documents.length > batchSize) {
    while (documents.length >= batchSize * i) {
      await seedMongo(R.slice(startIndex, endIndex, documents));
      await seedPG(R.slice(startIndex, endIndex, documents))
      const currentProgress = (endIndex / documents.length) * 100;

      progress = Math.round(currentProgress * 100) / 100

      startIndex += batchSize;
      endIndex += batchSize;
      i++;
    }
  } else {
    await seedMongo(documents);
    await seedPG(documents)
    progress = 100;
  }

  console.log(`\nInserted ${records} documents`);
  clearInterval(twirlTimer);
  return;
}