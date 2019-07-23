export default (
	state = {
		amount: 10,
		category: '',
		difficulty: '',
		isHost: false,
		type: ''
	},
	action
) => {
	switch (action.type) {
		case 'HOST_CREATE_GAME':
			state = { ...state, ...action.game, isHost: true }
			break
		default:
			break
	}
	return state
}
