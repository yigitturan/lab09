/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */

/**
 * This module implements an extended REST-inspired web service for the Monopoly DB.
 * The database is hosted on Azure PostgreSQL.
 *
 * This service supports multiple tables: Player, Game, PlayerGame, Property, PlayerProperty, and PlayerStatus.
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
 
 // Middleware to parse JSON bodies
 app.use(express.json());
 
 // Routes
 app.get('/', readHelloMessage);
 app.get('/players', readPlayers);
 app.get('/players/:id', readPlayer);
 app.put('/players/:id', updatePlayer);
 app.post('/players', createPlayer);
 app.delete('/players/:id', deletePlayer);
 
 app.get('/games', readGames);
 app.get('/games/:id', readGame);
 app.get('/playergame/:id', readPlayerGameScores);
 app.get('/playerstatus/:id', readPlayerStatus);
 app.get('/playerproperties', readAllPlayerProperties);
 app.get('/playerproperties/:id', readPlayerProperties);
 
 // Start the server
 app.listen(port, () => console.log(`Listening on port ${port}`));
 
 // Utility function for consistent responses
 function returnDataOr404(res, data) {
   if (data == null) {
     res.sendStatus(404);
   } else {
     res.send(data);
   }
 }
 
 // Route Handlers
 function readHelloMessage(req, res) {
   res.send('Hello, CS 262 Monopoly service (extended)!');
 }
 
 // Player CRUD
 function readPlayers(req, res, next) {
   db.many('SELECT * FROM player')
     .then((data) => res.send(data))
     .catch((err) => {
       console.error('Error reading players:', err);
       next(err);
     });
 }
 
 function readPlayer(req, res, next) {
   db.oneOrNone('SELECT * FROM player WHERE id=${id}', req.params)
     .then((data) => returnDataOr404(res, data))
     .catch((err) => {
       console.error(`Error reading player with id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 function updatePlayer(req, res, next) {
   db.oneOrNone(
     'UPDATE player SET email=${email}, name=${name} WHERE id=${id} RETURNING id',
     {
       id: req.params.id,
       email: req.body.email,
       name: req.body.name,
     }
   )
     .then((data) => returnDataOr404(res, data))
     .catch((err) => {
       console.error(`Error updating player with id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 function createPlayer(req, res, next) {
   db.one('INSERT INTO player(email, name) VALUES (${email}, ${name}) RETURNING id', req.body)
     .then((data) => res.send(data))
     .catch((err) => {
       console.error('Error creating player:', err);
       next(err);
     });
 }
 
 function deletePlayer(req, res, next) {
   db.oneOrNone('DELETE FROM player WHERE id=${id} RETURNING id', req.params)
     .then((data) => returnDataOr404(res, data))
     .catch((err) => {
       console.error(`Error deleting player with id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 // Additional Handlers
 function readGames(req, res, next) {
   console.log('Request received at /games');
   db.many('SELECT * FROM game ORDER BY time DESC')
     .then((data) => {
       console.log('Query result:', data);
       res.send(data);
     })
     .catch((err) => {
       console.error('Error reading games:', err);
       next(err);
     });
 }
 
 function readGame(req, res, next) {
   db.oneOrNone('SELECT * FROM game WHERE id=${id}', req.params)
     .then((data) => returnDataOr404(res, data))
     .catch((err) => {
       console.error(`Error reading game with id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 function readPlayerGameScores(req, res, next) {
   db.manyOrNone('SELECT * FROM playergame WHERE playerID=${id}', req.params)
     .then((data) => res.send(data))
     .catch((err) => {
       console.error(`Error reading player game scores for id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 function readPlayerStatus(req, res, next) {
   db.oneOrNone('SELECT * FROM playerstatus WHERE playerID=${id}', req.params)
     .then((data) => returnDataOr404(res, data))
     .catch((err) => {
       console.error(`Error reading player status for id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 function readPlayerProperties(req, res, next) {
   db.manyOrNone('SELECT * FROM playerproperty WHERE playerID=${id}', req.params)
     .then((data) => res.send(data))
     .catch((err) => {
       console.error(`Error reading player properties for id ${req.params.id}:`, err);
       next(err);
     });
 }
 
 
 ::contentReference[oaicite:0]{index=0}
  
 