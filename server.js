const express = require('express')
const https = require('https')
const cors = require('cors')
const bodyParser = require('body-parser')
const ws = require('ws')
const _ = require('lodash')
const fs = require('fs')
const fetch = require('node-fetch')
const next = require('next')
//Database functions.
const {
	getGames,
	postGames,
	putGames,
	deleteGames,
	postQuestions,
	postUsers,
	postPlayers,
	postScores
} = require('./database')

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
	const httpsServer = https.createServer(credentials, server)
	const wss = new ws.Server({ server: httpsServer })
	var clients = []

	server.get('/api/game', async (req, res) => {
		const games = await getGames()
		res.send(games)
		res.end
	})

	server.post('/api/game', async (req, res) => {
		const game = req.body.gameSettings
		// prettier-ignore
		let URL = `https://opentdb.com/api.php?amount=${game.amount}&category=${game.category}&difficulty=${game.difficulty}&type=${game.type}`
		let testURL =
			'https://f9c1f452-5f7d-43ab-adef-4093241aaae5.mock.pstmn.io/api.php?amount=10&type=multiple=multiple'
		//If value is 'any' then remove that parameter.
		URL = URL.replace(/(&.{1,10}=any)/g, '')
		const gameQuestions = await fetch(testURL).then(res => res.json())
		if (gameQuestions.response_code === 0) {
			const gameid = await postGames(game)
			let questions = gameQuestions.results.map((q, index) => {
				let answers = q.incorrect_answers
				answers.push(q.correct_answer)
				if (answers.length === 2) {
					answers = ['True', 'False']
				} else {
					answers.sort(() => Math.random() - 0.5)
				}
				let correct = answers.indexOf(q.correct_answer)
				correct = ['A', 'B', 'C', 'D'][correct]
				let question = {
					gameid,
					number: index + 1,
					question: q.question,
					answertype: q.type,
					a: answers[0],
					b: answers[1],
					c: answers[2],
					d: answers[3],
					correct
				}
				return question
			})
			for (const question of questions) {
				postQuestions(question)
			}
			res.send({ gameid })
			res.end
		} else {
			//handle error...
		}
	})

	server.put('/api/game', async (req, res) => {
		const state = req.body.state
		const gameID = req.body.gameID
		const qNumber = req.body.qNumber || 0
		if (_.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const game = await putGames({ state, gameID, qNumber })
			if (game.gamestate > 0) {
				var players = clients.filter(
					client => client.protocol === game.gameID
				)
				var gameboards = clients.filter(
					client => client.protocol === `gb_${game.gameID}`
				)
				//Timestamp for scoring.
				game.qStart = Date.now()
				gameboards.forEach(board => {
					if (board.readyState === ws.OPEN) {
						board.send(JSON.stringify(game))
					}
				})
				let p_game = game
				delete p_game.question
				delete p_game.answers
				delete p_game.correctAnswer
				players.forEach(player => {
					if (player.readyState === ws.OPEN) {
						player.send(JSON.stringify(p_game))
					}
				})
			}
			res.send(game)
			res.end
		}
	})

	server.delete('/api/game', async (req, res) => {
		const gameID = req.body.gameID
		if (_.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const deleted = await deleteGames(gameID)
			res.send(deleted)
			res.end
		}
	})

	server.post('/api/user', async (req, res) => {
		const userID = req.body.userID
		if (_.isUndefined(userID)) {
			res.sendStatus(400)
			res.end
		} else {
			const user = await postUsers(userID)
			res.send(user)
			res.end
		}
	})

	server.post('/api/player', async (req, res) => {
		const userID = req.body.userID
		const gameID = req.body.gameID
		if (_.isUndefined(userID) || _.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const joined = await postPlayers({ userID, gameID })
			var gameboards = clients.filter(
				client => client.protocol === `gb_${game.gameID}`
			)
			gameboards.forEach(board => {
				if (board.readyState === ws.OPEN) {
					board.send(JSON.stringify(game))
				}
			})
			res.send(joined)
			res.end
		}
	})

	server.post('/api/score', async (req, res) => {
		const answer = req.body.answer
		if (_.isUndefined(answer.questionID)) {
			res.sendStatus(400)
			res.end
		} else {
			const result = await postScores(answer)
			res.send(result)
			res.end
		}
	})

	server.get('/:route/:gameKey', (req, res) => {
		let route = req.params.route
		return app.render(req, res, `/${route}`, {
			gameKey: req.params.gameKey,
			...req.query
		})
	})

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	httpsServer.listen(port, function() {
		console.log(
			`Example app listening on port ${port}! Go to https://localhost:${port}/`
		)
	})

	wss.on('connection', function open(ws) {
		clients.push(ws)
		console.log(clients)
	})

	wss.on('close', function close() {
		console.log('disconnected')
	})
})
