-- Retrieve all scores for "The King" in decreasing order.
SELECT score FROM PlayerGame
JOIN Player ON PlayerGame.playerID = Player.ID
WHERE Player.name = 'The King'
ORDER BY score DESC;

-- Retrieve the name of the winner of the game on 2006-06-28 at 13:20:00.
SELECT Player.name FROM Game
JOIN PlayerGame ON Game.ID = PlayerGame.gameID
JOIN Player ON PlayerGame.playerID = Player.ID
WHERE Game.time = '2006-06-28 13:20:00'
ORDER BY PlayerGame.score DESC
LIMIT 1;

-- Retrieve players with the same name (self-join).
SELECT P1.name FROM Player AS P1, Player AS P2
WHERE P1.name = P2.name AND P1.ID < P2.ID;
