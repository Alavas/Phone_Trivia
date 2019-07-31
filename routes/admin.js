const express = require('express')
const adminRouter = express.Router()
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const db = require('../database')

function router({ checkUser, auth, JWTKEY }) {
	adminRouter.post('/login', async (req, res) => {
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

	adminRouter.get('/user', auth, async (req, res) => {
		const users = await db.getUsers()
		res.send(users)
		res.end
	})

	adminRouter.delete('/user/:id', auth, async (req, res) => {
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

	adminRouter.get('/game', auth, async (req, res) => {
		const games = await db.getGames()
		res.send(games)
		res.end
	})

	adminRouter.delete('/game/:id', auth, async (req, res) => {
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
	return adminRouter
}

module.exports = router
