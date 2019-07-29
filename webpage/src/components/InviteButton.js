import React, { useState } from 'react'
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import phone from 'phone'
import { sendSMS } from '../utilities'

const InviteButton = props => {
	const token = props.token
	const gameID = props.gameID
	const [invite, setInvite] = useState(false)
	const [visible, setVisible] = useState(false)
	const [number, setNumber] = useState({
		raw: '',
		parsed: '',
		country: '',
		valid: false
	})
	const handleChange = e => {
		const raw = e.target.value
		const parsed = phone(raw)
		if (parsed.length !== 0) {
			setNumber({
				raw: raw,
				parsed: parsed[0],
				country: parsed[1],
				valid: true
			})
		} else {
			setNumber({ raw: raw, parsed: '', country: '', valid: false })
		}
	}
	const handleHide = e => {
		setNumber({ raw: '', parsed: '', country: '', valid: false })
		setVisible(false)
	}
	const handleSubmit = async e => {
		e.preventDefault()
		await sendSMS({ token, gameID, smsTo: number.parsed })
		setInvite(true)
		handleHide()
	}
	return (
		<Button
			color={invite ? 'success' : 'danger'}
			size="lg"
			style={{ gridArea: '6/2/7/3' }}
			onClick={invite ? null : visible ? null : () => setVisible(true)}
			className={visible ? 'invite' : null}
		>
			{invite ? (
				'Invite Sent'
			) : visible ? (
				<Form onSubmit={e => e.preventDefault()}>
					<FormGroup>
						<Label>
							Enter A Phone Number
							<Input
								type="text"
								name="name"
								value={number.raw}
								valid={number.valid}
								invalid={!number.valid}
								onChange={e => handleChange(e)}
							/>
						</Label>
						<Row>
							<Col xs={{ size: 4, offset: 1 }}>
								<Input
									style={{
										background: '#ffc107',
										color: 'white',
										border: 'none'
									}}
									type="submit"
									value="Cancel"
									onClick={e => handleHide(e)}
								/>
							</Col>
							<Col xs={{ size: 4, offset: 2 }}>
								<Input
									style={{
										background: '#007bff',
										color: 'white',
										border: 'none'
									}}
									className={number.valid ? '' : 'invite-disabled'}
									type="submit"
									value="Send"
									onClickCapture={e => handleSubmit(e)}
								/>
							</Col>
						</Row>
					</FormGroup>
				</Form>
			) : (
				'Invite A Friend'
			)}
		</Button>
	)
}

export default InviteButton
