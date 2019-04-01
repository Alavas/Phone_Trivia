import getUuid from 'uuid-by-string'

export const convertImage = (url, callback) => {
	var img = new Image()
	img.crossOrigin = 'Anonymous'
	img.onload = function() {
		var canvas = document.createElement('CANVAS')
		var ctx = canvas.getContext('2d')
		var dataURL
		canvas.height = this.height
		canvas.width = this.width
		ctx.drawImage(this, 0, 0)
		dataURL = canvas.toDataURL('jpg')
		callback(dataURL)
		canvas = null
	}
	img.src = url
}

export const getCookie = cookie => {
	var name = cookie + '='
	var decodedCookie = decodeURIComponent(window.document.cookie)
	var ca = decodedCookie.split(';')
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) === ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ''
}

//Update/create cookie with a 30 day expiration.
export const updateCookie = userid => {
	let d = new Date()
	d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000)
	let expires = 'expires=' + d.toUTCString()
	document.cookie = `gs_userid=${userid}; expires=${expires}`
}

//Create UUID from the current time and the UserAgent details to ensure variances.
export const generateUUID = UA => {
	const ua = UA.replace(/\D+/g, '')
	const time = Date.now()
	return getUuid(`${ua} + ${time}`)
}

//Login to the game backend.
export const loginUser = async userID => {
	let data = JSON.stringify({ userID })
	const userDetails = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/user`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return userDetails
}

export const updateUser = async ({ userID, avatar }) => {
	let data = JSON.stringify({ userID, avatar })
	const user = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/user`,
		{
			method: 'PUT',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	)
	return user
}

export const getGames = async () => {
	const games = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
		{
			method: 'GET',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			}
		}
	).then(res => res.json())
	return games
}

//Request to create a new game.
export const createGame = async gameSettings => {
	let data = JSON.stringify({ gameSettings })
	const game = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return game.gameid
}

//Update gamestate and question number to display.
export const updateGame = async ({ state, gameID, qNumber }) => {
	let data = JSON.stringify({ state, gameID, qNumber })
	const game = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
		{
			method: 'PUT',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return game
}

//Delete a completed game.
export const deleteGame = async gameID => {
	let data = JSON.stringify({ gameID })
	const deleted = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
		{
			method: 'DELETE',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return deleted
}

//Join a game from QR code.
export const joinGame = async ({ userID, gameID }) => {
	let data = JSON.stringify({ userID, gameID })
	const joined = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/player`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return joined
}

//Submit answer to the current game.
export const submitAnswer = async answer => {
	let data = JSON.stringify({ answer })
	const result = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/score`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return result
}

//Connect gameboard to game.
export const connectGameboard = async gameboard => {
	let data = JSON.stringify(gameboard)
	const board = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/gameboard`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	)
	return board
}

//Possible question categories.
export const gameCategories = [
	{ value: 'any', display: 'Any Category' },
	{ value: 9, display: 'General Knowledge' },
	{ value: 16, display: 'Entertainment: Board Games' },
	{ value: 10, display: 'Entertainment: Books' },
	{ value: 32, display: 'Entertainment: Cartoon & Animations' },
	{ value: 29, display: 'Entertainment: Comics' },
	{ value: 11, display: 'Entertainment: Film' },
	{ value: 31, display: 'Entertainment: Japanese Anime & Manga' },
	{ value: 12, display: 'Entertainment: Music' },
	{ value: 13, display: 'Entertainment: Musicals & Theatres' },
	{ value: 14, display: 'Entertainment: Television' },
	{ value: 15, display: 'Entertainment: Video Games' },
	{ value: 18, display: 'Science: Computers' },
	{ value: 30, display: 'Science: Gadgets' },
	{ value: 17, display: 'Science: Nature' },
	{ value: 19, display: 'Science: Mathematics' },
	{ value: 20, display: 'Mythology' },
	{ value: 21, display: 'Sports' },
	{ value: 22, display: 'Geography' },
	{ value: 23, display: 'History' },
	{ value: 24, display: 'Politics' },
	{ value: 25, display: 'Art' },
	{ value: 27, display: 'Animals' },
	{ value: 26, display: 'Celebrities' },
	{ value: 28, display: 'Vehicles' }
]

//Game difficulty levels.
export const gameDifficulties = [
	{ value: 'any', display: 'Any Difficulty' },
	{ value: 'easy', display: 'Easy' },
	{ value: 'medium', display: 'Medium' },
	{ value: 'hard', display: 'Hard' }
]

//Possible question types.
export const questionType = [
	{ value: 'multiple', display: 'Multiple Choice' },
	{ value: 'boolean', display: 'True / False' },
	{ value: 'any', display: 'Mixed' }
]

export const gameStates = {
	NOTSTARTED: 0,
	CREATED: 1,
	STARTED: 2,
	QUESTIONS: 3,
	ENDED: 4,
	RESET: 5
}
