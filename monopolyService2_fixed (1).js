
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

/**
 * This module implements an extended REST-inspired webservice for the Monopoly DB.
 * The database is hosted on Azure PostgreSQL.
 *
 * This service now supports multiple tables: Player, Game, PlayerGame, Property, PlayerProperty, and PlayerStatus.
 *
 * Security measures are in place to prevent SQL injection via pg-promise's variable escaping.
 *
 * This service assumes that the database connection strings and the server mode are set in environment variables.
 * See the DB_* variables used by pg-promise. Setting NODE_ENV to production will cause ExpressJS to serve
 * up uninformative server error responses for all errors.
 */

const pgp = require('pg-promise')();
const express = require('express');

const db = pgp({
  host: process.env.DB_SERVER,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const app = express();
const port = process.env.PORT || 3000;
const router = express.Router();
router.use(express.json());

router.get('/', readHelloMessage);
router.get('/players', readPlayers);
router.get('/players/:id', readPlayer);
router.put('/players/:id', updatePlayer);
router.post('/players', createPlayer);
router.delete('/players/:id', deletePlayer);

// Additional routes based on new SQL tables
router.get('/games', readGames);
router.get('/games/:id', readGame);
router.get('/playergame/:id', readPlayerGameScores);
router.get('/playerstatus/:id', readPlayerStatus);
router.get('/playerproperties/:id', readPlayerProperties);

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));

function returnDataOr404(res, data) {
  if (data == null) {
    res.sendStatus(404);
  } else {
    res.send(data);
  }
}

function readHelloMessage(req, res) {
  res.send('Hello, CS 262 Monopoly service (extended)!');
}

// CRUD operations for Player
function readPlayers(req, res, next) {
  db.many('SELECT * FROM Player')
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function readPlayer(req, res, next) {
  db.oneOrNone('SELECT * FROM Player WHERE id=${id}', req.params)
    .then((data) => returnDataOr404(res, data))
    .catch((err) => next(err));
}

function updatePlayer(req, res, next) {
  db.oneOrNone('UPDATE Player SET email=${email}, name=${name} WHERE id=${id} RETURNING id', {
      id: req.params.id,
      email: req.body.email,
      name: req.body.name
    })
    .then((data) => returnDataOr404(res, data))
    .catch((err) => next(err));
}

function createPlayer(req, res, next) {
  db.one('INSERT INTO Player(email, name) VALUES (${email}, ${name}) RETURNING id', req.body)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function deletePlayer(req, res, next) {
  db.oneOrNone('DELETE FROM Player WHERE id=${id} RETURNING id', req.params)
    .then((data) => returnDataOr404(res, data))
    .catch((err) => next(err));
}

// Additional operations for Game, PlayerGame, PlayerStatus, and PlayerProperty
function readGames(req, res, next) {
  db.many('SELECT * FROM Game ORDER BY time DESC')
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function readGame(req, res, next) {
  db.oneOrNone('SELECT * FROM Game WHERE id=${id}', req.params)
    .then((data) => returnDataOr404(res, data))
    .catch((err) => next(err));
}

function readPlayerGameScores(req, res, next) {
  db.manyOrNone('SELECT * FROM PlayerGame WHERE playerID=${id}', req.params)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

function readPlayerStatus(req, res, next) {
  db.oneOrNone('SELECT * FROM PlayerStatus WHERE playerID=${id}', req.params)
    .then((data) => returnDataOr404(res, data))
    .catch((err) => next(err));
}

function readPlayerProperties(req, res, next) {
  db.manyOrNone('SELECT * FROM PlayerProperty WHERE playerID=${id}', req.params)
    .then((data) => res.send(data))
    .catch((err) => next(err));
}

module.exports = app;
