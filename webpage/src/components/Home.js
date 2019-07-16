import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/home.css'
import PhoneTrivia from '../images/PhoneTrivia.svg'

const Home = () => {
	return (
		<div className="home-container">
			<div className="home-title">
				<img src={PhoneTrivia} alt="Phone Trivia" />
				<h4>Play on your own or with a group of friends.</h4>
			</div>
			<div className="route-container">
				<Link to="/host" className="route">
					<h3>Start a Game</h3>
					<p>Create a new game, you'll be the host!</p>
				</Link>
				<Link to="/player" className="route">
					<h3>Join a Game</h3>
					<p>You'll need to scan the game QR code.</p>
				</Link>
				<a
					className="report-issue"
					href="https://forms.gle/kvVbjsCRHGuHkw8z6"
				>
					Report An Issue
				</a>
			</div>
		</div>
	)
}

export default Home
