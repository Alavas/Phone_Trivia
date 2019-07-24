const express = require('express')
const gameRouter = express.Router()
const _ = require('lodash')
const db = require('../database')
const gameStates = {
	NOTSTARTED: 0,
	CREATED: 1,
	STARTED: 2,
	QUESTIONS: 3,
	ENDED: 4,
	RESET: 5
}

function router({ dev, fetch, wsGame }) {
	gameRouter
		.route('/')
		.post(async (req, res) => {
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
		.put(async (req, res) => {
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
		.delete(async (req, res) => {
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
	return gameRouter
}

module.exports = router
