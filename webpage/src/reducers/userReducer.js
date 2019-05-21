export default (
	state = {
		avatar: null,
		loggedIn: false,
		points: 0,
		score: 0,
		totalScore: 0,
		userID: ''
	},
	action
) => {
	switch (action.type) {
		case 'USER_LOGIN_SUCCESS':
			state = {
				...state,
				userID: action.user.userid,
				avatar: action.user.avatar,
				loggedIn: true
			}
			break
		case 'USER_SET_AVATAR':
			state = { ...state, avatar: action.avatar }
			break
		case 'USER_SET_SCORE':
			state = {
				...state,
				totalScore: action.scores.totalScore,
				score: action.scores.score
			}
			break
		default:
			break
	}
	return state
}
