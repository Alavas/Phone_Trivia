import getUuid from 'uuid-by-string'

export const getCookie = cookie => {
	var name = cookie + '='
	var decodedCookie = decodeURIComponent(window.document.cookie)
	var ca = decodedCookie.split(';')
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) === ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length)
		}
	}
	return ''
}

export const updateCookie = userid => {
	document.cookie = `gs_userid=${userid}`
}

//Create UUID from the current time and the UserAgent details to ensure variances.
export const generateUUID = UA => {
	const ua = UA.replace(/\D+/g, '')
	const time = Date.now()
	return getUuid(`${ua} + ${time}`)
}

//Login to the game backend.
export const loginUser = async userID => {
	let data = JSON.stringify({ userID })
	const userDetails = await fetch(
		`${process.env.GAMESHOW_ENDPOINT}/api/user`,
		{
			method: 'POST',
			headers: {
				Accept: 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
			body: data
		}
	).then(res => res.json())
	return userDetails
}
