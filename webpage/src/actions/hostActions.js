export const hostCreateGame = game => ({
	type: 'HOST_CREATE_GAME',
	game
})

export const hostCreateGameError = error => ({
	type: 'HOST_CREATE_GAME_ERROR',
	error
})

export const hostQuestion = () => ({
	type: 'HOST_QUESTION'
})
