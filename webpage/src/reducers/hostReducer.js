export default (
	state = {
		amount: 10,
		category: '',
		difficulty: '',
		type: '',
		hostPlay: true,
		showModal: false
	},
	action
) => {
	switch (action.type) {
		case 'HOST_CREATE_GAME':
			state = { ...state, ...action.game }
			break
		case 'HOST_TOGGLE_MODAL':
			state = { ...state, modal: !state.modal }
			break
		default:
			break
	}
	return state
}
