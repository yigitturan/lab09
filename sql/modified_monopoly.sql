--
-- This SQL script builds a monopoly database, deleting any pre-existing version.
-- Updated for cs262 lab 7 and lab 8 requirements.
--

-- Drop previous versions of the tables if they exist, in reverse order of foreign keys.
DROP TABLE IF EXISTS PlayerProperty CASCADE;
DROP TABLE IF EXISTS Property CASCADE;
DROP TABLE IF EXISTS PlayerStatus CASCADE;
DROP TABLE IF EXISTS PlayerGame CASCADE;
DROP TABLE IF EXISTS Game CASCADE;
DROP TABLE IF EXISTS Player CASCADE;

-- Create the main schema tables.
CREATE TABLE Game (
    ID integer PRIMARY KEY,
    time timestamp
);

CREATE TABLE Player (
    ID integer PRIMARY KEY, 
    emailAddress varchar(50) NOT NULL,
    name varchar(50)
);

CREATE TABLE PlayerGame (
    gameID integer REFERENCES Game(ID), 
    playerID integer REFERENCES Player(ID),
    score integer,
    PRIMARY KEY (gameID, playerID)
);

-- Additional tables to support ongoing game progress.

-- Table to store properties in the game.
CREATE TABLE Property (
    ID integer PRIMARY KEY,
    name varchar(50) NOT NULL,
    price integer NOT NULL
);

-- Table to track player-owned properties and their state (houses, hotels).
CREATE TABLE PlayerProperty (
    gameID integer REFERENCES Game(ID),
    playerID integer REFERENCES Player(ID),
    propertyID integer REFERENCES Property(ID),
    houses integer DEFAULT 0,
    hotels integer DEFAULT 0,
    PRIMARY KEY (gameID, playerID, propertyID)
);

-- Table to track the player's status in the game (cash, position).
CREATE TABLE PlayerStatus (
    gameID integer REFERENCES Game(ID),
    playerID integer REFERENCES Player(ID),
    cash integer DEFAULT 1500,
    position integer DEFAULT 0,
    PRIMARY KEY (gameID, playerID)
);

-- Grant access permissions for public selection.
GRANT SELECT ON Game TO PUBLIC;
GRANT SELECT ON Player TO PUBLIC;
GRANT SELECT ON PlayerGame TO PUBLIC;
GRANT SELECT ON Property TO PUBLIC;
GRANT SELECT ON PlayerProperty TO PUBLIC;
GRANT SELECT ON PlayerStatus TO PUBLIC;

-- Add sample records for testing.
-- Sample games
INSERT INTO Game VALUES (1, '2006-06-27 08:00:00');
INSERT INTO Game VALUES (2, '2006-06-28 13:20:00');
INSERT INTO Game VALUES (3, '2006-06-29 18:41:00');
INSERT INTO Game VALUES (4, NOW()); -- A game for testing past week queries

-- Sample players, including some with duplicate names for self-join test.
INSERT INTO Player (ID, emailAddress, name) VALUES (1, 'me@calvin.edu', 'Player One');
INSERT INTO Player VALUES (2, 'king@gmail.com', 'The King');
INSERT INTO Player VALUES (3, 'dog@gmail.com', 'Dogbreath');
INSERT INTO Player VALUES (4, 'duplicate@gmail.com', 'The King'); -- Duplicate name for testing

-- Sample player-game scores, including high scores for testing.
INSERT INTO PlayerGame VALUES (1, 1, 0);
INSERT INTO PlayerGame VALUES (1, 2, 0);
INSERT INTO PlayerGame VALUES (1, 3, 2350);
INSERT INTO PlayerGame VALUES (2, 1, 1000);
INSERT INTO PlayerGame VALUES (2, 2, 0);
INSERT INTO PlayerGame VALUES (2, 3, 500);
INSERT INTO PlayerGame VALUES (3, 2, 0);
INSERT INTO PlayerGame VALUES (3, 3, 5500);
INSERT INTO PlayerGame VALUES (4, 3, 3000); -- High score for player 3 in the past week
INSERT INTO PlayerGame VALUES (4, 2, 500); -- Low score for The King in the past week

-- Sample properties
INSERT INTO Property VALUES (1, 'Boardwalk', 400);
INSERT INTO Property VALUES (2, 'Park Place', 350);

-- Sample player-owned properties
INSERT INTO PlayerProperty (gameID, playerID, propertyID, houses, hotels) VALUES (1, 1, 1, 2, 1);
INSERT INTO PlayerProperty (gameID, playerID, propertyID, houses, hotels) VALUES (1, 2, 2, 3, 0);

-- Sample player statuses
INSERT INTO PlayerStatus (gameID, playerID, cash, position) VALUES (1, 1, 1200, 5);
INSERT INTO PlayerStatus (gameID, playerID, cash, position) VALUES (1, 2, 800, 15);
