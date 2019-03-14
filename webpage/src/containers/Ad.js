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
					data-ad-client="ca-pub-1008239361616945"
					data-ad-slot="xxxxxxxxxx"
					enable_page_level_ads={true}
				/>
			</div>
		)
	}
}
