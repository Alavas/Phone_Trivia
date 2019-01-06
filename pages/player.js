import React, { Component } from 'react'
import Link from 'next/link'
import { getCookie, updateCookie, generateUUID, loginUser } from '../utilities'
import Head from '../components/head'
import Nav from '../components/nav'

class Player extends Component {
	constructor() {
		super()
		this.state = { userid: '', loggedIn: false }
	}

	static getInitialProps({ query }) {
		return { game: query }
	}

	componentDidMount() {
		let userid = getCookie('gs_userid')
		if (userid === '' || userid === 'undefined') {
			userid = generateUUID(window.navigator.userAgent)
		}
		this.userLogin(userid)
	}

	async userLogin(userID) {
		const userDetails = await loginUser(userID)
		updateCookie(userDetails.userid)
		this.setState({ ...userDetails, loggedIn: true })
	}

	render() {
		return (
			<div>
				<Head title="Gameshow" />
				<Nav />
				<div>
					<div className="row">
						<a className="card">
							<h3>JOIN A GAME</h3>
						</a>
						<Link href="/host">
							<a className="card">
								<h3>START A GAME</h3>
							</a>
						</Link>
					</div>
				</div>
				<style jsx>{`
					.row {
						max-width: 60%;
						margin-left: auto;
						margin-right: auto;
						margin-top: 100px;
						display: flex;
						flex-direction: column;
					}
					.card {
						padding: 18px 18px 24px;
						margin-bottom: 25px;
						text-decoration: none;
						text-align: center;
						color: #067df7;
						border: 1px solid #9b9b9b;
					}
					.card:hover {
						border-color: #067df7;
					}
					.card p {
						margin: 0;
						padding: 12px 0 0;
						font-size: 13px;
						color: #333;
					}
				`}</style>
			</div>
		)
	}
}

export default Player
