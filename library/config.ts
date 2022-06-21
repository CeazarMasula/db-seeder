const dbName = process.env.DB_NAME || "mongo_db";
const connectionString = `mongodb://localhost:27017/${dbName}?retryWrites=true&w=majority&socketTimeoutMS=360000&connectTimeoutMS=360000`;

const config = {
  connectionString,
};

export = config;