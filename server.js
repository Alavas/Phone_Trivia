const express = require('express')
const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
	const server = express()

	server.get('/:route/:gameKey', (req, res) => {
		let route = req.params.route
		return app.render(req, res, `/${route}`, {
			gameKey: req.params.gameKey,
			...req.query
		})
	})

	/*
	server.get('/player/:gameKey', (req, res) => {
		return app.render(req, res, '/player', {
			gameKey: req.params.gameKey,
			...req.query
		})
	})
	
	server.get('/host/:gameKey', (req, res) => {
		return app.render(req, res, '/host', {
			gameKey: req.params.gameKey,
			...req.query
		})
	})

	server.get('/game/:gameKey', (req, res) => {
		return app.render(req, res, '/game', {
			gameKey: req.params.gameKey,
			...req.query
		})
	})
	*/
	server.get('*', (req, res) => {
		return handle(req, res)
	})

	server.listen(port, err => {
		if (err) throw err
		console.log(`> Ready on http://localhost:${port}`)
	})
})
