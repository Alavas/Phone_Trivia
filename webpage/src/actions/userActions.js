export const userLogin = () => ({
	type: 'USER_LOGIN'
})

export const userLoginSuccess = user => ({
	type: 'USER_LOGIN_SUCCESS',
	user
})

export const userLoginError = err => ({
	type: 'USER_LOGIN_ERROR',
	err
})

export const userSetAvatar = avatar => ({
	type: 'USER_SET_AVATAR',
	avatar
})

export const userSetScore = score => ({
	type: 'USER_SET_SCORE',
	score
})
