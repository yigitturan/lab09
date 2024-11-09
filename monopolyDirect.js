/* eslint-disable no-console */
/**
 * This module implements direct, Android-to-Postgres access to the Monopoly DB.
 * The database is hosted on Azure PostgreSQL. I needed to add my local public
 * IP address to the Azure networking firewall access list.
 *
 * Because the PGP connection variables are stored as Heroku config vars, store
 * those values in .env (stored locally and listed in .gitignore so that they're
 * not pushed to GitHub, e.g., one line would be DB_PORT=5432).
 *
 *      source .env-azure
 *      node monopolyDirect.js
 *
 * @author: kvlinden
 * @date: Summer, 2020
 * @date: Fall, 2024 - updates for Azure PostgreSQL
 */

// Set up the database connection.
const pgp = require('pg-promise')();

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // For SSL, see: https://stackoverflow.com/questions/22301722/ssl-for-postgresql-connection-nodejs
  ssl: true,
});

// Send the SQL command directly to Postgres.
db.many('SELECT * FROM Player')
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log('ERROR:', error);
  });
