CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (userid uuid PRIMARY KEY, avatar text, score int);

CREATE TABLE IF NOT EXISTS games (gameid uuid PRIMARY KEY, userid uuid REFERENCES users(userid), created timestamptz, ended timestamptz, gamestate int DEFAULT 0, question int DEFAULT 0);

CREATE TABLE IF NOT EXISTS questions (questionid uuid PRIMARY KEY, gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, number int, question varchar(500), answertype varchar(50), a varchar(255), b varchar(255), c varchar(255), d varchar(255), correct varchar(1));

CREATE TABLE IF NOT EXISTS scores (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, questionid uuid REFERENCES questions(questionid), userid uuid REFERENCES users(userid), answer varchar(50), reaction int, correct bool, score integer, winner bool);

CREATE TABLE IF NOT EXISTS players (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, userid uuid REFERENCES users(userid), UNIQUE(userid));
