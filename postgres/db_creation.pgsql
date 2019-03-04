CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (userid uuid PRIMARY KEY, avatar text, score int);

CREATE TABLE IF NOT EXISTS games (gameid uuid PRIMARY KEY, userid uuid REFERENCES users(userid), created timestamptz, ended timestamptz, gamestate int DEFAULT 0, question int DEFAULT 0);

CREATE TABLE IF NOT EXISTS questions (questionid uuid PRIMARY KEY, gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, number int, question varchar(500), answertype varchar(50), a varchar(255), b varchar(255), c varchar(255), d varchar(255), correct varchar(1));

CREATE TABLE IF NOT EXISTS scores (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, questionid uuid REFERENCES questions(questionid), userid uuid REFERENCES users(userid), answer varchar(1), reaction int, correct bool, score integer, winner bool);

CREATE TABLE IF NOT EXISTS players (gameid uuid REFERENCES games(gameid) ON DELETE CASCADE, userid uuid REFERENCES users(userid), UNIQUE(userid));

/* Add new entry into the scores table and update the users table with current score. */
CREATE OR REPLACE FUNCTION newscore (
	v_gameid uuid,
	v_questionid uuid,
	v_userid uuid,
	v_answer varchar(1),
	v_reaction int,
	v_score int
)
RETURNS void AS $$
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
	UPDATE users SET score = score + v_score WHERE userid = v_userid;
END;
$$ LANGUAGE plpgsql;

/* Adds a player to the game and resets their score to zero. */
CREATE OR REPLACE FUNCTION newPlayer (
	v_gameid uuid,
	v_userid uuid
)
RETURNS void AS $$
BEGIN
	INSERT INTO players (gameid, userid) VALUES (v_gameid, v_userid) ON CONFLICT (userid) DO UPDATE SET gameid = v_gameid;
	UPDATE users SET score = 0 WHERE userid = v_userid;
END;
$$ LANGUAGE plpgsql;

/* Gets scores for the supplied questionID. */
CREATE OR REPLACE FUNCTION getscore(v_questionid uuid) 
RETURNS TABLE (
	userid uuid,
	answer varchar(50),
	reaction int,
	correct bool,
	score int,
	winner bool,
	totalscore int
) 
AS $$
BEGIN
RETURN query 
	SELECT s.userid, s.answer, s.reaction, s.correct, s.score, s.winner, u.score AS totalscore FROM scores AS s 
	INNER JOIN users AS u ON u.userid = s.userid
	WHERE s.questionid = v_questionid;
END;
$$ LANGUAGE plpgsql;
