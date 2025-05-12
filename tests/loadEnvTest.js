const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.test") });

console.log('> [loadEnvTest] DATABASE_URL=', process.env.DATABASE_URL);