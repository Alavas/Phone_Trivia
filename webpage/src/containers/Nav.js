import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo'
import Avatar from 'react-avatar-edit'
import _ from 'lodash'
import PhoneTriviaSVG from '../images/PhoneTrivia.svg'
import AboutSVG from '../images/About.svg'
import {
	userLogin,
	userShowAvatarModal,
	userSetAvatar
} from '../actions/userActions'
import { appReset, appError } from '../actions/appActions'
import About from '../components/About'
import '../styles/nav.css'

class Nav extends Component {
	constructor(props) {
		super(props)
		this.state = {
			photoTaken: false,
			dataUri: '',
			preview: null,
			aboutModal: false
		}
		this.handleAboutModal = this.handleAboutModal.bind(this)
		this.onCrop = this.onCrop.bind(this)
		this.toggleModalCamera = this.toggleModalCamera.bind(this)
		this.takePhoto = this.takePhoto.bind(this)
		this.videoRef = React.createRef()
	}
	componentDidMount() {
		this.props.login()
	}

	handleAboutModal() {
		this.setState(prevstate => ({
			aboutModal: !prevstate.aboutModal
		}))
	}

	startCamera() {
		this.setState({ photoTaken: false }, () => {
			this.cameraPhoto = new CameraPhoto(this.videoRef.current)
			this.cameraPhoto.startCamera(FACING_MODES.USER).catch(error => {
				this.props.error('Camera not started!')
			})
		})
	}

	stopCamera() {
		if (this.cameraPhoto.stream !== null) {
			this.cameraPhoto.stopCamera().catch(error => {
				this.props.error('Could not stop camera!')
			})
		}
	}

	takePhoto() {
		const config = {
			sizeFactor: 1.0,
			imageType: 'jpg',
			imageCompression: 1.0,
			isImageMirror: false
		}

		let dataUri = this.cameraPhoto.getDataUri(config)
		this.setState({ dataUri, photoTaken: true })
		this.stopCamera()
	}

	saveAvatar() {
		this.props.avatar(this.state.preview)
		this.toggleModalCamera()
	}

	onCrop(preview) {
		this.setState({ preview })
	}

	hideError() {
		const errorToast = document.getElementById('error-toast')
		errorToast.className = errorToast.className.replace('show', 'hide')
	}

	toggleModalCamera() {
		if (this.props.user.showAvatarModal) {
			//Shutdown the camera before closing the modal.
			this.stopCamera()
			this.props.modal()
		} else {
			//Start the camera before displaying the modal.
			this.startCamera()
			this.props.modal()
		}
	}

	render() {
		return (
			<nav className="fixed-bottom">
				<ul>
					<li>
						{/*eslint-disable*/}
						{this.props.pathname === '/' ? (
							<a
								className="phone-trivia"
								onClick={() => this.handleAboutModal()}
							>
								<img src={AboutSVG} alt="About" />
							</a>
						) : (
							<a
								className="phone-trivia"
								onClick={() => this.props.reset()}
							>
								<img src={PhoneTriviaSVG} alt="PhoneTrivia" />
							</a>
						)}
						{/*eslint-enable*/}
					</li>
					<small className="copyright">
						&copy; Copyright 2019, Justin Savala
					</small>
					<ul>
						<li
							style={
								_.isUndefined(this.props.user.totalScore) ||
								this.props.pathname === '/' ||
								!this.props.game.joined
									? { display: 'none' }
									: {
											marginTop: '5px',
											color: 'lightslategray',
											textShadow: '2px 2px #0d1260'
									  }
							}
						>
							<h3>{this.props.user.totalScore}</h3>
						</li>
						<li
							style={
								_.isNull(this.props.user.avatar) ||
								this.props.user.avatar === ''
									? { display: 'none' }
									: { padding: '0px', marginTop: '-1.5px' }
							}
						>
							<img
								src={this.props.user.avatar}
								alt="avatar"
								className="avatar-img"
								onClick={() => this.toggleModalCamera()}
							/>
						</li>
					</ul>
				</ul>
				<div
					id="error-toast"
					className="hide"
					onClick={() => this.hideError()}
				>
					{this.props.app.error}
				</div>
				<div id="player-toast" className="hide">
					<p>
						<img
							src={this.props.game.newPlayer}
							alt="avatar"
							className="avatar-img"
							onClick={() => this.toggleModalCamera()}
						/>
						Joined the game.
					</p>
				</div>
				<div
					id="score-toast"
					className="hide"
					style={
						this.props.user.score
							? { color: 'limegreen' }
							: { color: 'crimson' }
					}
				>
					+{this.props.user.score}
				</div>
				<Modal
					isOpen={this.props.user.showAvatarModal}
					toggle={this.toggleModalCamera}
				>
					<ModalHeader className="avatar-header">
						Create your own Avatar!
					</ModalHeader>
					<ModalBody>
						<div>
							{this.state.photoTaken ? (
								<div className="avatar-container">
									<div className="avatar-editor">
										<Avatar
											imageWidth={300}
											onCrop={this.onCrop}
											onClose={this.onClose}
											closeIconColor="none"
											src={this.state.dataUri}
										/>
									</div>
								</div>
							) : (
								<video
									className="avatar-live"
									ref={this.videoRef}
									autoPlay={true}
								/>
							)}
						</div>
					</ModalBody>
					<ModalFooter>
						{this.state.photoTaken ? (
							<React.Fragment>
								<Button
									color="danger"
									onClick={() => this.startCamera()}
								>
									Try Again
								</Button>
								<Button
									color="success"
									onClick={() => this.saveAvatar()}
								>
									Save
								</Button>
							</React.Fragment>
						) : (
							<Button color="success" onClick={() => this.takePhoto()}>
								Take Photo
							</Button>
						)}

						<Button
							color="primary"
							onClick={() => this.toggleModalCamera()}
						>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
				<About
					showModal={this.state.aboutModal}
					toggleModal={this.handleAboutModal}
				/>
			</nav>
		)
	}
}

const mapStateToProps = state => {
	return {
		pathname: state.router.location.pathname,
		app: state.app,
		user: state.user,
		game: state.game
	}
}

const mapDispatchToProps = dispatch => {
	return {
		avatar: avatar => dispatch(userSetAvatar(avatar)),
		error: error => dispatch(appError(error)),
		login: () => dispatch(userLogin()),
		reset: () => dispatch(appReset()),
		modal: () => dispatch(userShowAvatarModal())
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Nav)
