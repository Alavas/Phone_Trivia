export const userReducer = (
	state = {
		avatar: '',
		loggedIn: false,
		score: 0,
		userID: ''
	},
	action
) => {
	switch (action.type) {
		case 'USER_LOGIN_SUCCESS':
			state = { ...state, ...action.user, loggedIn: true }
			break
		default:
			break
	}
	return state
}
