export const gameSetGameID = gameID => ({
	type: 'GAME_UPDATE_ID',
	gameID
})

export const gameStateUpdate = gamestate => ({
	type: 'GAME_UPDATE_STATE',
	gamestate
})

export const gameJoin = gameID => ({
	type: 'GAME_JOIN',
	gameID
})

export const gameJoinSuccess = gameID => ({
	type: 'GAME_JOIN_SUCCESS',
	gameID
})

export const gameJoinError = error => ({
	type: 'GAME_JOIN_ERROR',
	error
})

export const gameSubmitAnswer = answer => ({
	type: 'GAME_SUBMIT_ANSWER',
	answer
})

export const gameSubmitAnswerError = () => ({
	type: 'GAME_SUBMIT_ANSWER_ERROR'
})

export const gameUpdateAnswer = answer => ({
	type: 'GAME_UPDATE_ANSWER',
	answer
})

export const gameShowAnswer = () => ({
	type: 'GAME_SHOW_ANSWER'
})

export const gameEnd = gameID => ({
	type: 'GAME_END',
	gameID
})
