const express = require('express')
const https = require('https')
const cors = require('cors')
const bodyParser = require('body-parser')
const _ = require('lodash')
const fs = require('fs')
const fetch = require('node-fetch')
const next = require('next')
const { Pool } = require('pg')

const postgres = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://postgres:H@ck3r$@localhost:5432/gameshow',
	ssl: process.env.SSL_STATE || false
})

const credentials = {
	key: fs.readFileSync('certificate/server.key'),
	cert: fs.readFileSync('certificate/server.cert')
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express()
	server.use(cors())
	server.use(bodyParser.json())

	server.get('/:route/:gameKey', (req, res) => {
		let route = req.params.route
		return app.render(req, res, `/${route}`, {
			gameKey: req.params.gameKey,
			...req.query
		})
	})

	server.post('/api/newgame', async (req, res) => {
		const game = req.body.gameSettings
		// prettier-ignore
		let URL = `https://opentdb.com/api.php?amount=${game.amount}&category=${game.category}&difficulty=${game.difficulty}&type=${game.type}`
		let testURL = `https://1b976eed-0a7d-4d14-b3b4-9ab759dbdedf.mock.pstmn.io/api.php?amount=10&type=multiple`
		//If value is 'any' then remove that parameter.
		URL = URL.replace(/(&.{1,10}=any)/g, '')
		const gameQuestions = await fetch(URL).then(res => res.json())
		if (gameQuestions.response_code === 0) {
			const gameid = await newGame(game)
			let questions = gameQuestions.results.map((q, index) => {
				let answers = q.incorrect_answers
				answers.push(q.correct_answer)
				answers.sort(() => Math.random() - 0.5)
				let correct = answers.indexOf(q.correct_answer)
				correct = ['A', 'B', 'C', 'D'][correct]
				let question = {
					gameid,
					number: index + 1,
					question: q.question,
					a: answers[0],
					b: answers[1],
					c: answers[2],
					d: answers[3],
					correct
				}
				return question
			})
			for (const question of questions) {
				let result = await newQuestion(question)
			}
			res.send({ gameid })
			res.end
		} else {
			//handle error...
		}
	})

	server.post('/api/user', async (req, res) => {
		const userID = req.body.userID
		if (_.isUndefined(userID)) {
			res.sendStatus(400)
			res.end
		} else {
			const user = await userCheck(userID)
			res.send(user)
			res.end
		}
	})

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	https.createServer(credentials, server).listen(port, function() {
		console.log(
			`Example app listening on port ${port}! Go to https://localhost:${port}/`
		)
	})
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
