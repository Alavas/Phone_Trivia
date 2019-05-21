export const userLogin = () => ({
	type: 'USER_LOGIN'
})

export const userLoginSuccess = user => ({
	type: 'USER_LOGIN_SUCCESS',
	user
})

export const userLoginError = error => ({
	type: 'USER_LOGIN_ERROR',
	error
})

export const userSetAvatar = avatar => ({
	type: 'USER_SET_AVATAR',
	avatar
})

export const userSetScore = scores => ({
	type: 'USER_SET_SCORE',
	scores
})
