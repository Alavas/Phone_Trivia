const express = require('express')
const playerRouter = express.Router()
const _ = require('lodash')
const db = require('../database')

function router({ wsPlayers }) {
	playerRouter
		.route('/')
		.get(async (req, res) => {
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
		.post(async (req, res) => {
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
	return playerRouter
}

module.exports = router
