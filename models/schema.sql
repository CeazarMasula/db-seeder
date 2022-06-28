DROP TABLE IF EXISTS "Members";
CREATE TABLE IF NOT EXISTS "Members" (
  "id" SERIAL PRIMARY KEY,
  "firstName" VARCHAR(100),
  "lastName" VARCHAR(100),
  "age" int8,
  "gender" VARCHAR(10),
  "birthdate" timestamp(6),
  "country" VARCHAR(100),
  "teamNumber" int8
);

CREATE TABLE IF NOT EXISTS "Teams" (
  "id" int8 PRIMARY KEY,
  "name" VARCHAR(100)
);