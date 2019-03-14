import React from 'react'

export default class Ad extends React.Component {
	componentDidMount() {
		;(window.adsbygoogle = window.adsbygoogle || []).push({})
	}

	render() {
		return (
			<div className="ad">
				<ins
					className="adsbygoogle"
					style={{
						display: 'inline-block',
						width: '320px',
						height: '100px'
					}}
					data-ad-client="ca-pub-1008239361616945"
					data-ad-slot="9268492262"
				/>
			</div>
		)
	}
}
