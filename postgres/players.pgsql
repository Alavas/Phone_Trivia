CREATE TABLE IF NOT EXISTS players (gameid uuid REFERENCES games(gameid), userid uuid REFERENCES users(userid));
