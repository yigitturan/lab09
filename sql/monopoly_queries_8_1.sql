-- Retrieve a list of all games, ordered by date with the most recent game coming first.
SELECT * FROM Game ORDER BY time DESC;

-- Retrieve all games that occurred in the past week.
SELECT * FROM Game WHERE time >= NOW() - INTERVAL '7 days';

-- Retrieve a list of players with non-NULL names.
SELECT * FROM Player WHERE name IS NOT NULL;

-- Retrieve a list of player IDs for those with a game score larger than 2000.
SELECT playerID FROM PlayerGame WHERE score > 2000;

-- Retrieve a list of players with Gmail accounts.
SELECT * FROM Player WHERE emailAddress LIKE '%@gmail.com';

SELECT * FROM playerproperties;
