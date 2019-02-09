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
	newGame,
	updateGame,
	newQuestion,
	userCheck,
	joinGame
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
	var players = []

	server.get('/:route/:gameKey', (req, res) => {
		let route = req.params.route
		return app.render(req, res, `/${route}`, {
			gameKey: req.params.gameKey,
			...req.query
		})
	})

	server.post('/api/game', async (req, res) => {
		const game = req.body.gameSettings
		// prettier-ignore
		let URL = `https://opentdb.com/api.php?amount=${game.amount}&category=${game.category}&difficulty=${game.difficulty}&type=${game.type}`
		let testURL =
			'https://1b976eed-0a7d-4d14-b3b4-9ab759dbdedf.mock.pstmn.io/api.php?amount=10&type=multiple'
		//If value is 'any' then remove that parameter.
		URL = URL.replace(/(&.{1,10}=any)/g, '')
		const gameQuestions = await fetch(testURL).then(res => res.json())
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
				newQuestion(question)
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
		if (_.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const gamestate = await updateGame({ state, gameID })
			res.send({ gamestate })
			res.end
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

	server.post('/api/player', async (req, res) => {
		const userID = req.body.userID
		const gameID = req.body.gameID
		if (_.isUndefined(userID) || _.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const joined = await joinGame({ userID, gameID })
			res.send(joined)
			res.end
		}
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
		players.push({ [ws.protocol]: ws })
		console.log(players)
	})

	wss.on('close', function close() {
		console.log('disconnected')
	})
})
