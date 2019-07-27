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
const jwt = require('express-jwt')
const twilio = require('twilio')
const db = require('./database')

const gameStates = {
	NOTSTARTED: 0,
	CREATED: 1,
	STARTED: 2,
	QUESTIONS: 3,
	ENDED: 4,
	RESET: 5
}

require('dotenv').config()
const accountSid = process.env.TWILIO_SID
const authToken = process.env.TWILIO_TOKEN
const from = process.env.TWILIO_FROM
const JWTKEY = process.env.JWTKEY || 'dev-key'
const dev = process.env.NODE_ENV !== 'production'
const PORT = parseInt(process.env.PORT, 10) || 5000
console.log('DEV:', dev)
//Global variable to store WebSocket clients.
var clients = []

const auth = jwt({
	secret: JWTKEY
})
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

const adminRouter = require('./routes/admin')({
	checkUser,
	auth,
	JWTKEY
})
const gameRouter = require('./routes/game')({ dev, fetch, wsGame })
const playerRouter = require('./routes/player')({ wsPlayers })
const userRouter = require('./routes/user')({ JWTKEY, auth })
app.use('/api/admin', adminRouter)
app.use('/api/game', auth, gameRouter)
app.use('/api/player', auth, playerRouter)
app.use('/api/user', userRouter)

app.get('/robots.txt', (req, res) => {
	res.type('text/plain')
	res.send('User-agent: *\nDisallow: /')
})

app.post('/api/sms', auth, async (req, res) => {
	const to = req.body.smsTo
	const gameID = req.body.gameID
	client.messages
		.create({
			body: `Join me playing Phone Trivia here: ${
				process.env.REACT_APP_GAMESHOW_ENDPOINT
			}/player/${gameID}`,
			to,
			from
		})
		.then(() => res.sendStatus(200))
		.catch(() => res.sendStatus(400))
})

app.post('/api/score', auth, async (req, res) => {
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

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}!`)
})

wss.on('connection', ws => {
	ws.on('message', data => wsReceiveData(data))
	clients.push(ws)
})

wss.on('close', () => {
	console.log('disconnected')
})

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'webpage/build')))
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'webpage/build', 'index.html'))
	})
}

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
