const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const next = require('next')
const { Pool } = require('pg')

const postgres = new Pool({
	connectionString:
		process.env.DATABASE_URL ||
		'postgresql://postgres:H@ck3r$@localhost:5432/gameshow',
	ssl: process.env.SSL_STATE || false
})

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express()
	server.use(bodyParser.json())

	server.get('/:route/:gameKey', (req, res) => {
		let route = req.params.route
		return app.render(req, res, `/${route}`, {
			gameKey: req.params.gameKey,
			...req.query
		})
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

	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(port, err => {
		if (err) throw err
		console.log(`> Ready on http://localhost:${port}`)
	})
})

async function userCheck(userID) {
	try {
		const query = `SELECT * FROM users WHERE userid = '${userID}';`
		const client = await postgres.connect()
		const result = await client.query(query)
		if (result.rowCount > 0) {
			const results = result.rows[0]
			client.release()
			return results
		} else {
			const Query = `INSERT INTO users (userid, username, score) VALUES ('${userID}', '', 0);`
			const result = await client.query(Query)
			if (result.rowCount > 0) {
				client.release()
				return {
					userid: `${userID}`,
					username: '',
					score: 0
				}
			} else {
				client.release()
				return { error: 'unable to insert' }
			}
		}
	} catch (err) {
		return err
	}
}
