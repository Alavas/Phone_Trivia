export default (
	state = {
		error: ''
	},
	action
) => {
	switch (action.type) {
		case 'APP_ERROR':
			state = { ...state, error: action.error }
			break
		default:
			break
	}
	return state
}
