const express = require('express')
const userRouter = express.Router()
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const db = require('../database')

function router({ JWTKEY, auth }) {
	userRouter.post('/', async (req, res) => {
		const userID = req.body.userID
		if (_.isUndefined(userID)) {
			res.sendStatus(400)
			res.end
		} else {
			const user = await db.postUsers(userID)
			let token = jwt.sign({ userID: user.userid }, JWTKEY, {
				expiresIn: 86400
			})
			user.token = token
			res.send(user)
			res.end
		}
	})
	userRouter.put('/', auth, async (req, res) => {
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
	return userRouter
}

module.exports = router
