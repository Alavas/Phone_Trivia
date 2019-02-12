CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (userid uuid PRIMARY KEY, avatar text, score int);

CREATE TABLE IF NOT EXISTS games (gameid uuid PRIMARY KEY, userid uuid REFERENCES users(userid), created timestamptz, ended timestamptz, gamestate int DEFAULT 0, question int DEFAULT 0);

CREATE TABLE IF NOT EXISTS questions (questionid uuid PRIMARY KEY, gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, number int, question varchar(500), answertype varchar(50), a varchar(255), b varchar(255), c varchar(255), d varchar(255), correct varchar(1));

CREATE TABLE IF NOT EXISTS scores (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, questionid uuid REFERENCES questions(questionid), userid uuid REFERENCES users(userid), answer varchar(1), reaction int, correct bool, score integer, winner bool);

CREATE TABLE IF NOT EXISTS players (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, userid uuid REFERENCES users(userid), UNIQUE(userid));

/* Add new entry into the scores table. */
CREATE OR REPLACE FUNCTION newscore (
	v_gameid uuid,
	v_questionid uuid,
	v_userid uuid,
	v_answer varchar(1),
	v_reaction int,
	v_score int
)
RETURNS bool AS $v_winner$
DECLARE 
	v_winner bool := false;
	v_correct bool := false;
BEGIN
	SELECT EXISTS(SELECT correct FROM questions WHERE questionid = v_questionid AND correct = v_answer) INTO v_correct;
	IF v_correct = true THEN
		SELECT NOT EXISTS(SELECT winner FROM scores WHERE questionid = v_questionid AND winner = true) INTO v_winner;
	ELSE
		v_score := 0;
	END IF;
	INSERT INTO scores (gameid, questionid, userid, answer, reaction, correct, score, winner) 
	VALUES (v_gameid, v_questionid, v_userid, v_answer, v_reaction, v_correct, v_score, v_winner);
	RETURN v_winner;
END;
$v_winner$ LANGUAGE plpgsql;