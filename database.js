const { Pool } = require('pg')

const postgres = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://postgres:H@ck3r$@localhost:5432/gameshow',
	ssl: process.env.SSL_STATE || false
})

async function newGame(game) {
	try {
		// prettier-ignore
		const query = `INSERT INTO games (gameid, userid, created, ended, gamestate) VALUES (uuid_generate_v4(), '${game.host}', NOW()::timestamp, null, 0) RETURNING gameid;`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			return result.rows[0].gameid
		} else {
			client.release()
			return { error: 'unable to insert' }
		}
	} catch (err) {
		return err
	}
}

async function newQuestion(question) {
	try {
		// prettier-ignore
		const query = `INSERT INTO questions (questionid, gameid, number, question, a, b, c, d, correct) VALUES (uuid_generate_v4(), '${question.gameid}', ${question.number}, '${question.question}', '${question.a}', '${question.b}', '${question.c}', '${question.d}', '${question.correct}');`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			return
		} else {
			client.release()
			return { error: 'unable to insert' }
		}
	} catch (err) {
		return err
	}
}

async function userCheck(userID) {
	try {
		const query = `SELECT * FROM users WHERE userid = '${userID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			const results = result.rows[0]
			client.release()
			return results
		} else {
			const Query = `INSERT INTO users (userid, username, score) VALUES ('${userID}', '', 0);`
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

module.exports = { newGame, newQuestion, userCheck }
