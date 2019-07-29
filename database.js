const { Pool } = require('pg')

const postgres = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://postgres:H@ck3r$@localhost:5432/gameshow',
	ssl: process.env.SSL_STATE || false
})

async function getAdmin(username) {
	try {
		// prettier-ignore
		const query = `SELECT * FROM admins WHERE username = '${username}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return { exists: true, data: result.rows[0] }
		} else {
			return { exists: false, data: 'Username or password is incorrect.' }
		}
	} catch (err) {
		return err
	}
}

async function getGames() {
	try {
		// prettier-ignore
		const query = `SELECT * FROM games;`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return result.rows
		} else {
			return []
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

async function putGames({ gamestate, gameID, qNumber }) {
	try {
		// prettier-ignore
		const query = `UPDATE games SET gamestate = ${gamestate} WHERE gameid = '${gameID}' RETURNING gamestate;`
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
					gamestate,
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
					gamestate,
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

async function getUsers() {
	try {
		// prettier-ignore
		const query = `SELECT * FROM users;`
		const client = await postgres.connect()
		const result = await client.query(query)
		client.release()
		if (result.rowCount > 0) {
			return result.rows
		} else {
			return { error: 'No users found.' }
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
			await updateUserLogin(userID)
			return results
		} else {
			const Query = `INSERT INTO users (userid, score, created, lastlogin) VALUES ('${userID}', 0, NOW()::timestamp, NOW()::timestamp);`
			const result = await client.query(Query)
			if (result.rowCount > 0) {
				client.release()
				return {
					userid: `${userID}`,
					avatar: null,
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

async function updateUserLogin(userID) {
	try {
		// prettier-ignore
		const query = `UPDATE users SET lastlogin = NOW()::timestamp WHERE userid = '${userID}';`
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

async function putUsers({ userID, avatar }) {
	try {
		// prettier-ignore
		const query = `UPDATE users SET avatar = '${avatar}' WHERE userid = '${userID}';`
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

async function deleteUsers(userID) {
	try {
		// prettier-ignore
		const query = `DELETE FROM users WHERE userid = '${userID}';`
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

async function getPlayer(userID) {
	try {
		// prettier-ignore
		const query = `SELECT userid, avatar FROM users WHERE userid = '${userID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			let players = result.rows
			return players[0]
		} else {
			client.release()
			return []
		}
	} catch (err) {
		return []
	}
}

async function getPlayers(gameID) {
	try {
		// prettier-ignore
		const query = `SELECT u.userid, u.avatar FROM users as u INNER JOIN players AS p ON p.userid = u.userid WHERE p.gameid = '${gameID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			let players = result.rows
			return players
		} else {
			client.release()
			return []
		}
	} catch (err) {
		return []
	}
}

async function postPlayers({ userID, gameID }) {
	try {
		// prettier-ignore
		const query = `SELECT newplayer(v_gameid := '${gameID}', v_userid := '${userID}');`
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

async function getScores(questionID) {
	try {
		// prettier-ignore
		const query = `SELECT * FROM getscore('${questionID}')`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			client.release()
			let scores = result.rows
			return scores
		} else {
			client.release()
			return []
		}
	} catch (err) {
		return []
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

/*  */
async function cleanupGames() {
	try {
		console.log('Deleting games older than 1 day.')
		const query = `DELETE FROM games WHERE age(NOW():: timestamp, created) > '1 days';`
		const client = await postgres.connect()
		const result = await client.query(query)
		console.log(`Deleted ${result.rowCount} games.`)
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

module.exports = {
	getAdmin,
	getGames,
	postGames,
	putGames,
	deleteGames,
	postQuestions,
	getUsers,
	postUsers,
	putUsers,
	deleteUsers,
	getPlayer,
	getPlayers,
	postPlayers,
	getScores,
	postScores,
	cleanupGames
}
