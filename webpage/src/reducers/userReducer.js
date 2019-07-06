export default (
	state = {
		avatar: null,
		correct: false,
		loggedIn: false,
		photoTaken: false,
		score: 0,
		showAvatarModal: false,
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
				score: action.scores.score,
				correct: action.scores.correct
			}
			break
		case 'USER_SHOW_AVATAR_MODAL':
			state = { ...state, showAvatarModal: !state.showAvatarModal }
			break
		default:
			break
	}
	return state
}
