import React from 'react'
import NextHead from 'next/head'
import { string } from 'prop-types'
import 'bootstrap/dist/css/bootstrap.min.css'

const defaultDescription = ''
const defaultOGURL = ''
const defaultOGImage = ''

const Head = props => (
	<NextHead>
		<meta charSet="UTF-8" />
		<title>{props.title || ''}</title>
		<meta
			name="description"
			content={props.description || defaultDescription}
		/>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="icon" sizes="192x192" href="/static/touch-icon.png" />
		<link rel="apple-touch-icon" href="/static/touch-icon.png" />
		<link rel="mask-icon" href="/static/favicon-mask.svg" color="#49B882" />
		<link rel="icon" href="/static/favicon.ico" />
		<meta property="og:url" content={props.url || defaultOGURL} />
		<meta property="og:title" content={props.title || ''} />
		<meta
			property="og:description"
			content={props.description || defaultDescription}
		/>
		<meta name="twitter:site" content={props.url || defaultOGURL} />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content={props.ogImage || defaultOGImage} />
		<meta property="og:image" content={props.ogImage || defaultOGImage} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<link
			href="https://fonts.googleapis.com/css?family=Dosis:400,700"
			rel="stylesheet"
		/>
		<link
			rel="stylesheet"
			href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"
			integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"
			crossorigin="anonymous"
		/>
	</NextHead>
)

Head.propTypes = {
	title: string,
	description: string,
	url: string,
	ogImage: string
}

export default Head
