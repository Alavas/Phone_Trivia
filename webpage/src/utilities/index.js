import getUuid from 'uuid-by-string'
import { promisify } from 'es6-promisify'

//Takes in an image URL and returns a BASE64 encoded data file.
function convertImage(url, callback) {
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
		callback(null, dataURL)
		canvas = null
	}
	img.src = url
}

//Promisify the convertImage function.
export const getDefaultAvatar = promisify(convertImage)

//Retrieve the user cookie if exists.
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
	document.cookie = `gs_userid=${userid}; expires=${expires}; path='/'`
}

//Create UUID from the current time and the UserAgent details to ensure variances.
export const generateUUID = UA => {
	const ua = UA.replace(/\D+/g, '')
	const time = Date.now()
	return getUuid(`${ua} + ${time}`)
}

//Update the avatar of the user.
export const updateUser = async ({ userID, avatar, token }) => {
	let data = JSON.stringify({ userID, avatar })
	const user = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/user`,
		{
			method: 'PUT',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data
		}
	)
	return user
}

//Update gamestate and question number to display.
export const updateGame = async ({ gamestate, gameID, qNumber = 0, token }) => {
	let data = JSON.stringify({ gamestate, gameID, qNumber })
	const game = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/game`,
		{
			method: 'PUT',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data
		}
	).then(res => res.json())
	return game
}

//Join a game from QR code.
export const joinGame = async ({ userID, gameID, token }) => {
	let data = JSON.stringify({ userID, gameID })
	const joined = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/player`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data
		}
	).then(res => res.json())
	return joined
}

//Submit answer to the current game.
export const submitAnswer = async ({ answer, token }) => {
	let data = JSON.stringify({ answer })
	const result = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/score`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data
		}
	).then(res => res.json())
	return result
}

//Send SMS to invite a friend to play.
export const sendSMS = async ({ gameID, smsTo, token }) => {
	let data = JSON.stringify({ gameID, smsTo })
	const result = await fetch(
		`${process.env.REACT_APP_GAMESHOW_ENDPOINT}/api/sms`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: data
		}
	)
	return result.status
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

//Game question types.
export const questionType = [
	{ value: 'multiple', display: 'Multiple Choice' },
	{ value: 'boolean', display: 'True / False' },
	{ value: 'any', display: 'Mixed' }
]

//Gamestates for consistency.
export const gameStates = {
	NOTSTARTED: 0,
	CREATED: 1,
	STARTED: 2,
	QUESTIONS: 3,
	ENDED: 4,
	RESET: 5
}
