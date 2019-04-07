import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'

const Home = () => {
	return (
		<div className="home-container">
			<h1 className="home-title">Welcome to Phone Trivia!</h1>
			<h4
				style={{
					textAlign: 'center',
					fontSize: '1em',
					color: 'lightslategray',
					marginTop: '10px',
					textShadow: '2px 2px #0d1260'
				}}
			>
				Play on your own or with a group of friends.
			</h4>
			<div className="route-container">
				<Link to="/host" className="route">
					<h3>Start a Game</h3>
					<p>Create your own game, you'll be the host!</p>
				</Link>
				<Link to="/player" className="route">
					<h3>Join a Game</h3>
					<p>You'll need to scan the game QR code.</p>
				</Link>
				<a
					style={{ textAlign: 'center', fontSize: '1em' }}
					href="https://forms.gle/kvVbjsCRHGuHkw8z6"
				>
					Report An Issue
				</a>
			</div>
		</div>
	)
}

export default Home
