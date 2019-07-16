import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'

const About = props => {
	return (
		<Modal isOpen={props.showModal} toggle={props.toggleModal}>
			<ModalHeader className="about-header">About Phone Trivia</ModalHeader>
			<ModalBody>
				<div className="about">
					<p>Thank you for checking out Phone Trivia!</p>
					<p>
						Questions from Phone Trivia are made possible by the Open
						Trivia Database found at{' '}
						<a href="https://opentdb.com">https://opentdb.com.</a> Their
						great API was the inspiration for this game. You have the
						choice to either create a game or join a game. If you choose
						to create a game you'll get a QR code that others can scan to
						join the game. The best thing about Phone Trivia is there's no
						logging in, no creating a user, and no annoying passwords to
						remember. When you visit the site a new user gets created for
						you and you'll get a nice random avatar image. If you don't
						like that one then you can tap on the avatar and you can make
						your own! Play a game or two and tell me what you think!
					</p>
					<p>
						If you have any questions or suggestions please email me at{' '}
						<a href="mailto:justin@phonetrivia.com">
							justin@phonetrivia.com
						</a>
					</p>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button color="danger" onClick={props.toggleModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	)
}

export default About
