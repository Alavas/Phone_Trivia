const { Pool } = require('pg')

const postgres = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://postgres:H@ck3r$@localhost:5432/gameshow',
	ssl: process.env.SSL_STATE || false
})

async function getGames() {
	try {
		// prettier-ignore
		const query = `SELECT gameid FROM games;`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return result.rows
		} else {
			return { error: 'no games found' }
		}
	} catch (err) {
		return err
	}
}

async function postGames(game) {
	try {
		// prettier-ignore
		const query = `INSERT INTO games (gameid, userid, created, ended, gamestate) VALUES (uuid_generate_v4(), '${game.host}', NOW()::timestamp, null, 0) RETURNING gameid;`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return result.rows[0].gameid
		} else {
			return { error: 'unable to insert' }
		}
	} catch (err) {
		return err
	}
}

async function putGames({ state, gameID, qNumber }) {
	try {
		// prettier-ignore
		const query = `UPDATE games SET gamestate = ${state} WHERE gameid = '${gameID}' RETURNING gamestate;`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			const query = `SELECT * FROM questions WHERE gameid = '${gameID}' AND number = ${qNumber};`
			const client = await postgres.connect()
			const result = await client.query(query)
			client.release()
			var game = {}
			if (result.rowCount > 0) {
				game = {
					gameID,
					gamestate: state,
					qNumber,
					questionID: result.rows[0].questionid,
					answertype: result.rows[0].answertype,
					question: result.rows[0].question,
					answers: [
						result.rows[0].a,
						result.rows[0].b,
						result.rows[0].c,
						result.rows[0].d
					],
					correctAnswer: result.rows[0].correct
				}
			} else {
				game = {
					gameID,
					gamestate: state,
					qNumber,
					questionID: '',
					answertype: '',
					question: '',
					answers: []
				}
			}
			return game
		} else {
			return { error: 'unable to insert' }
		}
	} catch (err) {
		return err
	}
}

async function deleteGames(gameid) {
	try {
		// prettier-ignore
		const query = `DELETE FROM games WHERE gameid = '${gameid}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return true
		} else {
			return false
		}
	} catch (err) {
		return err
	}
}

async function postQuestions(q) {
	try {
		// prettier-ignore
		const query = `INSERT INTO questions (questionid, gameid, number, question, answertype, a, b, c, d, correct) VALUES (uuid_generate_v4(), '${q.gameid}', ${q.number}, '${q.question}', '${q.answertype}', '${q.a}', '${q.b}', '${q.c}', '${q.d}', '${q.correct}');`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return
		} else {
			return { error: 'unable to insert' }
		}
	} catch (err) {
		return err
	}
}

async function postUsers(userID) {
	try {
		const query = `SELECT * FROM users WHERE userid = '${userID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			const results = result.rows[0]
			return results
		} else {
			const Query = `INSERT INTO users (userid, score) VALUES ('${userID}', 0);`
			const result = await client.query(Query)
			if (result.rowCount > 0) {
				client.release()
				return {
					userid: `${userID}`,
					username: '',
					score: 0
				}
			} else {
				client.release()
				return { error: 'unable to insert' }
			}
		}
	} catch (err) {
		return err
	}
}

async function postPlayers({ userID, gameID }) {
	try {
		// prettier-ignore
		const query = `INSERT INTO players (gameid, userid) VALUES ('${gameID}', '${userID}') ON CONFLICT (userid) DO UPDATE SET gameid = '${gameID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			return true
		} else {
			client.release()
			return true
		}
	} catch (err) {
		return false
	}
}

async function postScores(a) {
	try {
		// prettier-ignore
		const query = `SELECT newscore(v_gameid := '${a.gameID}', v_questionid := '${a.questionID}', v_userid := '${a.userID}', v_answer := '${a.answer}', v_reaction := ${a.reaction}, v_score := ${a.score});`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			return true
		} else {
			client.release()
			return false
		}
	} catch (err) {
		return false
	}
}

module.exports = {
	getGames,
	postGames,
	putGames,
	deleteGames,
	postQuestions,
	postUsers,
	postPlayers,
	postScores
}
