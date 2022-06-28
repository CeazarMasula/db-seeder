import mongoMemberModel from "../models/mongo-member-model";
import mongoTeamModel from "../models/mongo-team-model";
import chance from "./chance";
import pgDatabaseClient from "./pg-database-client";
import format from 'pg-format';
import R from 'ramda';

async function insertPGMembers(documents: Record<string, any>[]) {
  const values = documents.map(document => Object.keys(document)
    .map(function(key) {
        return document[key];
    }));

  const sql = format(`INSERT INTO "Members" ("firstName", "lastName", "age", "gender", "birthdate", "country", "teamNumber") 
    VALUES %L`, values);

  await pgDatabaseClient.query(sql)
}

async function insertPGTeams(documents: Record<string, any>[]) {
  const values = documents.map(document => Object.keys(document)
    .map(function(key) {
        return document[key];
    }));

  const sql = format(`INSERT INTO "Teams" ("id", "name") 
    VALUES %L`, values);

  await pgDatabaseClient.query(sql)
}

export default async function (records: number) {
  let memberDocuments = [];
  let teamDocuments = [];

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

  // Limit max number of teams to 100 
  const maxTeamCount = records / 2 < 50 ? records / 2 : 50;
  const teamCount = chance.integer({ min: 1, max: maxTeamCount });

  const teamIds = chance.unique(chance.integer, teamCount, { min: 0, max: 50 });
  const teamNames = chance.unique(chance.animal, teamCount);

  for (let i = 0; i < teamCount; i++) {
    teamDocuments.push({
      id: teamIds[i],
      name: teamNames[i]
    })
  }

  for (let i = 0; i < records; i++) {
    const name = chance.name().split(' ');
    memberDocuments.push({
      firstName: name[0],
      lastName: name[1],
      age: chance.age(),
      gender: chance.gender(),
      birthdate: new Date(chance.birthday()),
      country: chance.country({ full: true }),
      teamNumber: chance.pickone(teamIds)
    })
  }

  await mongoMemberModel.deleteMany({});
  await mongoTeamModel.deleteMany({});
  await pgDatabaseClient.query(`DELETE FROM "Members"; DELETE FROM "Teams"`)

  await mongoTeamModel.insertMany(teamDocuments);
  await insertPGTeams(teamDocuments);

  if (memberDocuments.length > batchSize) {
    while (memberDocuments.length >= batchSize * i) {
      await mongoMemberModel.insertMany(R.slice(startIndex, endIndex, memberDocuments));
      await insertPGMembers(R.slice(startIndex, endIndex, memberDocuments))
      const currentProgress = (endIndex / memberDocuments.length) * 100;

      progress = Math.round(currentProgress * 100) / 100

      startIndex += batchSize;
      endIndex += batchSize;
      i++;
    }
  } else {
    await mongoMemberModel.insertMany(memberDocuments);
    await insertPGMembers(memberDocuments)
    progress = 100;
  }

  console.log(`\nInserted ${records} documents`);
  clearInterval(twirlTimer);
  return;
}