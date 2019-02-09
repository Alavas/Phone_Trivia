import getUuid from 'uuid-by-string'

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

export const updateCookie = userid => {
	document.cookie = `gs_userid=${userid}`
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
		`${process.env.GAMESHOW_ENDPOINT}/api/user`,
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

//Request to create a new game.
export const createGame = async gameSettings => {
	let data = JSON.stringify({ gameSettings })
	const game = await fetch(`${process.env.GAMESHOW_ENDPOINT}/api/game`, {
		method: 'POST',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: data
	}).then(res => res.json())
	return game.gameid
}

export const updateGame = async ({ state, gameID, qNumber }) => {
	let data = JSON.stringify({ state, gameID, qNumber })
	const game = await fetch(`${process.env.GAMESHOW_ENDPOINT}/api/game`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: data
	}).then(res => res.json())
	return game
}

export const joinGame = async ({ userID, gameID }) => {
	let data = JSON.stringify({ userID, gameID })
	const joined = await fetch(`${process.env.GAMESHOW_ENDPOINT}/api/player`, {
		method: 'POST',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: data
	}).then(res => res.json())
	return joined
}

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
	{ value: 17, display: 'Science &amp; Nature' },
	{ value: 18, display: 'Science: Computers' },
	{ value: 19, display: 'Science: Mathematics' },
	{ value: 20, display: 'Mythology' },
	{ value: 21, display: 'Sports' },
	{ value: 22, display: 'Geography' },
	{ value: 23, display: 'History' },
	{ value: 24, display: 'Politics' },
	{ value: 25, display: 'Art' },
	{ value: 27, display: 'Animals' },
	{ value: 26, display: 'Celebrities' },
	{ value: 28, display: 'Vehicles' },
	{ value: 30, display: 'Science: Gadgets' }
]

export const gameDifficulties = [
	{ value: 'any', display: 'Any Difficulty' },
	{ value: 'easy', display: 'Easy' },
	{ value: 'medium', display: 'Medium' },
	{ value: 'hard', display: 'Hard' }
]

export const questionType = [
	{ value: 'any', display: 'Any Type' },
	{ value: 'multiple', display: 'Multiple Choice' },
	{ value: 'boolean', display: 'True / False' }
]
