export const appReset = () => ({
	type: 'APP_RESET'
})

export const appError = error => ({
	type: 'APP_ERROR',
	error
})
