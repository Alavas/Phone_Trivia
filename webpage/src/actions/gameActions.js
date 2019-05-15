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

export const gameJoinError = err => ({
	type: 'GAME_JOIN_ERROR',
	err
})
