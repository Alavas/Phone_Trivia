const express = require('express')
const compression = require('compression')
const slashes = require('connect-slashes')
const https = require('https')
const http = require('http')
const cors = require('cors')
const path = require('path')
const enforce = require('express-sslify')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const ws = require('ws')
const _ = require('lodash')
const fs = require('fs')
const fetch = require('node-fetch')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const twilio = require('twilio')
require('dotenv').config()
//Database functions.
const db = require('./database')

const gameStates = {
	NOTSTARTED: 0,
	CREATED: 1,
	STARTED: 2,
	QUESTIONS: 3,
	ENDED: 4,
	RESET: 5
}

const SALTROUNDS = 10
const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const from = process.env.TWILIO_FROM
const PORT = parseInt(process.env.PORT, 10) || 5000
const JWTKEY = process.env.JWTKEY || 'dev-key'
const dev = process.env.NODE_ENV !== 'production'
console.log('DEV:', dev)
//Global variable to store WebSocket clients.
var clients = []

const client = new twilio(accountSid, authToken)
const app = express()
app.use(morgan('short'))
app.use(compression())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(slashes(false))
app.use(enforce.HTTPS({ trustProtoHeader: true }))
app.use(cors())
if (dev) {
	const credentials = {
		key: fs.readFileSync('certificate/server.key'),
		cert: fs.readFileSync('certificate/server.cert')
	}
	var server = https.createServer(credentials, app)
} else {
	var server = http.createServer(app)
}
const wss = new ws.Server({ server })

app.get('/robots.txt', function(req, res) {
	res.type('text/plain')
	res.send('User-agent: *\nDisallow: /')
})

app.post('/api/sms', async (req, res) => {
	const to = req.body.smsTo
	const gameID = req.body.gameID
	client.messages
		.create({
			body: `Join me playing Phone Trivia here. ${
				process.env.REACT_APP_GAMESHOW_ENDPOINT
			}/player/${gameID}`,
			to,
			from
		})
		.then(() => res.sendStatus(200))
		.catch(() => res.sendStatus(400))
})

app.post('/api/game', async (req, res) => {
	const game = req.body.gameSettings
	var URL = ''
	// prettier-ignore
	if (dev) {
		URL =
			'https://f9c1f452-5f7d-43ab-adef-4093241aaae5.mock.pstmn.io/api.php?amount=10&type=multiple=multiple'
	} else {

		URL = `https://opentdb.com/api.php?amount=${game.amount}&category=${game.category}&difficulty=${game.difficulty}&type=${game.type}`
	}
	//If value is 'any' then remove that parameter.
	URL = URL.replace(/(&.{1,10}=any)/g, '')
	const gameQuestions = await fetch(URL).then(res => res.json())
	if (gameQuestions.response_code === 0) {
		const gameid = await db.postGames(game)
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
			db.postQuestions(question)
		}
		res.send({ gameid })
		res.end
	} else {
		//handle error...
	}
})

app.put('/api/game', async (req, res) => {
	const gamestate = req.body.gamestate
	const gameID = req.body.gameID
	const qNumber = req.body.qNumber || 0
	if (_.isUndefined(gameID)) {
		res.sendStatus(400)
		res.end
	} else {
		const game = await db.putGames({ gamestate, gameID, qNumber })
		if (game.gamestate > gameStates.NOTSTARTED) {
			wsGame(game)
		}
		res.send(game)
		res.end
	}
})

app.delete('/api/game', async (req, res) => {
	const gameID = req.body.gameID
	if (_.isUndefined(gameID)) {
		res.sendStatus(400)
		res.end
	} else {
		const deleted = await db.deleteGames(gameID)
		wsGame({ gameID, gamestate: gameStates.RESET })
		res.send(deleted)
		res.end
	}
})

app.post('/api/user', async (req, res) => {
	const userID = req.body.userID
	if (_.isUndefined(userID)) {
		res.sendStatus(400)
		res.end
	} else {
		const user = await db.postUsers(userID)
		res.send(user)
		res.end
	}
})

app.put('/api/user', async (req, res) => {
	const avatar = req.body.avatar
	const userID = req.body.userID
	if (_.isUndefined(userID)) {
		res.sendStatus(400)
		res.end
	} else {
		const user = await db.putUsers({ userID, avatar })
		res.send(user)
		res.end
	}
})

app.get('/api/player', async (req, res) => {
	const gameID = req.query.gameID
	if (_.isUndefined(gameID)) {
		res.sendStatus(400)
		res.end
	} else {
		const players = await db.getPlayers(gameID)
		res.send(players)
		res.end
	}
})

app.post('/api/player', async (req, res) => {
	const userID = req.body.userID
	const gameID = req.body.gameID
	if (_.isUndefined(userID) || _.isUndefined(gameID)) {
		res.sendStatus(400)
		res.end
	} else {
		const joined = await db.postPlayers({ userID, gameID })
		wsPlayers(gameID)
		res.send(joined)
		res.end
	}
})

app.post('/api/score', async (req, res) => {
	const answer = req.body.answer
	if (_.isUndefined(answer.questionID)) {
		res.sendStatus(400)
		res.end
	} else {
		const result = await db.postScores(answer)
		const scores = await db.getScores(answer.questionID)
		wsScores(answer.gameID, scores)
		res.send(result)
		res.end
	}
})

app.post('/api/admin/login', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	const admin = await checkUser({
		username,
		password
	})
	if (admin.valid) {
		let token = jwt.sign({ adminID: admin.adminID }, JWTKEY, {
			expiresIn: 86400
		})
		res.json({ token })
		res.end
	} else {
		res.sendStatus(401)
		res.end
	}
})

app.get('/api/admin/user', authenticate, async (req, res) => {
	const users = await db.getUsers()
	res.send(users)
	res.end
})

app.delete('/api/admin/user/:id', authenticate, async (req, res) => {
	const userID = req.params.id
	if (_.isUndefined(userID)) {
		res.sendStatus(400)
		res.end
	} else {
		const deleted = await db.deleteUsers(userID)
		res.send(deleted)
		res.end
	}
})

app.get('/api/admin/game', authenticate, async (req, res) => {
	const games = await db.getGames()
	res.send(games)
	res.end
})

app.delete('/api/admin/game/:id', authenticate, async (req, res) => {
	const gameID = req.params.id
	if (_.isUndefined(gameID)) {
		res.sendStatus(400)
		res.end
	} else {
		const deleted = await db.deleteGames(gameID)
		res.send(deleted)
		res.end
	}
})

server.listen(PORT, function() {
	console.log(`Listening on port ${PORT}!`)
})

wss.on('connection', function open(ws) {
	ws.on('message', data => wsReceiveData(data))
	clients.push(ws)
})

wss.on('close', function close() {
	console.log('disconnected')
})

if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, 'webpage/build')))
	// Handle React routing, return all requests to React app
	app.get('*', function(req, res) {
		res.sendFile(path.join(__dirname, 'webpage/build', 'index.html'))
	})
}

/* Admin Functions */

/*
async function createHash(password) {
	const hash = await bcrypt.hash(password, SALTROUNDS)
	return hash
}
*/

async function checkUser({ username, password }) {
	const admin = await db.getAdmin(username)
	let match
	if (admin.exists) {
		match = await bcrypt.compare(password, admin.data.pwhash)
	}
	if (match) {
		return { valid: true, adminID: admin.data.adminid }
	} else {
		return { valid: false }
	}
}

function authenticate(req, res, next) {
	var token = req.headers['x-access-token']
	if (!token) {
		return res
			.status(401)
			.send({ auth: false, message: 'No token provided.' })
	}
	jwt.verify(token, JWTKEY, (err, decoded) => {
		if (err) {
			return res
				.status(500)
				.send({ auth: false, message: 'Failed to authenticate token.' })
		} else {
			req.decoded = decoded
			next()
		}
	})
}

/* **WebSocket functions.** */

//Receive commands from Host/Player.
function wsReceiveData(data) {
	const action = JSON.parse(data)
	switch (action.type) {
		case 'SHOW_ANSWER':
			wsShowAnswer(action.gameID)
			break
		//TODO: Listen for message from Player to leave game.
		default:
			break
	}
}

function wsShowAnswer(gameID) {
	let players = clients.filter(client => client.protocol === gameID)
	players.forEach(player => {
		if (player.readyState === ws.OPEN) {
			player.send(JSON.stringify({ type: 'WS_SHOW_ANSWER', data: true }))
		}
	})
}

//Broadcasts current player information to a specified game.
async function wsPlayers(gameID) {
	let players = await db.getPlayers(gameID)
	let gameboards = clients.filter(client => client.protocol === `gb_${gameID}`)
	gameboards.forEach(board => {
		if (board.readyState === ws.OPEN) {
			board.send(JSON.stringify({ players }))
		}
	})
}

//Broadcasts scores to the gameboards.
//Keep for other use??
async function wsScores(gameID, scores) {
	let players = clients.filter(client => client.protocol === gameID)
	let gameboards = clients.filter(client => client.protocol === `gb_${gameID}`)
	players.forEach(player => {
		if (player.readyState === ws.OPEN) {
			player.send(JSON.stringify({ type: 'WS_SCORES', data: scores }))
		}
	})
}

//Broadcasts questions and gamestate for a specified game.
async function wsGame(game) {
	let players = clients.filter(client => client.protocol === game.gameID)
	//Send list of players to the players for displaying the scores at the end.
	if (game.gamestate === gameStates.STARTED) {
		let gamePlayers = await db.getPlayers(game.gameID)
		players.forEach(player => {
			if (player.readyState === ws.OPEN) {
				player.send(
					JSON.stringify({ type: 'WS_PLAYERS', data: gamePlayers })
				)
			}
		})
	}
	players.forEach(player => {
		if (player.readyState === ws.OPEN) {
			player.send(JSON.stringify({ type: 'WS_GAME', data: game }))
		}
	})
}
