const express = require('express')
const userRouter = express.Router()
const _ = require('lodash')
const db = require('../database')

function router() {
	userRouter
		.route('/')
		.post(async (req, res) => {
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
		.put(async (req, res) => {
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
