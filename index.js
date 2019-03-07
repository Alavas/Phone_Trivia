const express = require('express')
const slashes = require('connect-slashes')
const https = require('https')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const ws = require('ws')
const _ = require('lodash')
const fs = require('fs')
const cron = require('node-cron')
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
	putUsers,
	getPlayers,
	postPlayers,
	getScores,
	postScores,
	cleanupGames
} = require('./database')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
//Global variable to store WebSocket clients.
var clients = []

//Removes old games, check every hour at the 15 minute mark.
cron.schedule('15 */1 * * *', cleanupGames)

app.prepare().then(() => {
	const server = express()
	server.use(bodyParser.json({ limit: '50mb' }))
	server.use(slashes(false))
	server.use(cors())
	if (dev) {
		const credentials = {
			key: fs.readFileSync('certificate/server.key'),
			cert: fs.readFileSync('certificate/server.cert')
		}
		var wsServer = https.createServer(credentials, server)
	} else {
		var wsServer = http.createServer(server)
	}
	const wss = new ws.Server({ server: wsServer })

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
				wsGame(game)
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
			wsGame({ gameID, gamestate: 5 }) //5 = RESET
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

	server.put('/api/user', async (req, res) => {
		const avatar = req.body.avatar
		const userID = req.body.userID
		if (_.isUndefined(userID)) {
			res.sendStatus(400)
			res.end
		} else {
			const user = putUsers({ userID, avatar })
			res.send(user)
			res.end
		}
	})

	server.get('/api/player', async (req, res) => {
		const gameID = req.query.gameID
		if (_.isUndefined(gameID)) {
			res.sendStatus(400)
			res.end
		} else {
			const players = await getPlayers(gameID)
			res.send(players)
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
			wsPlayers(gameID)
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
			const scores = await getScores(answer.questionID)
			wsScores(answer.gameID, scores)
			res.send(result)
			res.end
		}
	})

	server.post('/api/gameboard', (req, res) => {
		const userID = req.body.userID
		const gameID = req.body.gameID
		wsGameboard({ userID, gameID, gamestate: 1 })
		res.sendStatus(201)
		res.end
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

	wsServer.listen(port, function() {
		console.log(`Listening on port ${port}!`)
	})

	wss.on('connection', function open(ws) {
		clients.push(ws)
	})

	wss.on('close', function close() {
		console.log('disconnected')
	})
})

/* **WebSocket functions.** */

function wsGameboard(gameboard) {
	let gameboards = clients.filter(
		client => client.protocol === `${gameboard.userID}`
	)
	gameboards.forEach(board => {
		if (board.readyState === ws.OPEN) {
			board.send(JSON.stringify(gameboard))
		}
	})
	//Update the protocol of the gameboard client to be gb_{gameID}.
	clients = clients.map(client => {
		if (client.protocol === gameboard.userID) {
			client.protocol = `gb_${gameboard.gameID}`
		}
		return client
	})
}

//Broadcasts current player information to a specified game.
async function wsPlayers(gameID) {
	let players = await getPlayers(gameID)
	let gameboards = clients.filter(client => client.protocol === `gb_${gameID}`)
	gameboards.forEach(board => {
		if (board.readyState === ws.OPEN) {
			board.send(JSON.stringify({ players }))
		}
	})
}

//Broadcasts scores to the gameboards.
async function wsScores(gameID, scores) {
	let gameboards = clients.filter(client => client.protocol === `gb_${gameID}`)
	gameboards.forEach(board => {
		if (board.readyState === ws.OPEN) {
			board.send(JSON.stringify({ scores }))
		}
	})
}

//Broadcasts questions and gamestate for a specified game.
async function wsGame(game) {
	let players = clients.filter(client => client.protocol === game.gameID)
	let gameboards = clients.filter(
		client => client.protocol === `gb_${game.gameID}`
	)
	//Timestamp for scoring.
	game.qStart = Date.now()
	gameboards.forEach(board => {
		if (board.readyState === ws.OPEN) {
			board.send(JSON.stringify(game))
		}
	})
	delete game.question
	delete game.answers
	delete game.correctAnswer
	players.forEach(player => {
		if (player.readyState === ws.OPEN) {
			player.send(JSON.stringify(game))
		}
	})
}
