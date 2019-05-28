export default (
	state = {
		amount: 10,
		category: '',
		difficulty: '',
		isHost: false,
		type: '',
		showModal: false
	},
	action
) => {
	switch (action.type) {
		case 'HOST_CREATE_GAME':
			state = { ...state, ...action.game, isHost: true }
			break
		case 'HOST_TOGGLE_MODAL':
			state = { ...state, modal: !state.modal }
			break
		default:
			break
	}
	return state
}
