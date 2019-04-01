class CountdownBar extends HTMLElement {
	constructor() {
		super()
		this.updateSize = this.updateSize.bind(this)
		const shadowRoot = this.attachShadow({ mode: 'open' })
		const div = document.createElement('div')
		div.innerHTML = '<span id="countdown-bar" class="countdown-bar"></span>'
		const style = document.createElement('style')
		style.textContent = `
      .progress-container {
			height: 20px;
         width: 100%;
         margin-left: auto;
         margin-right: auto;
         position: relative;
         background: #0d1620;
         -moz-border-radius: 20px;
         -webkit-border-radius: 20px;
         border-radius: 20px;
      }
      .countdown-bar { 
			width: 100%;
         display: block;
			height: 100%;
			-moz-border-radius: 20px;
         -webkit-border-radius: 20px;
         border-radius: 20px;
         background-color: limegreen;
         position: relative;
			overflow: hidden; 
      }
      `
		div.setAttribute('class', 'progress-container')
		shadowRoot.appendChild(style)
		shadowRoot.appendChild(div)
	}
	get duration() {
		return this.getAttribute('duration')
	}
	get delay() {
		return this.getAttribute('delay')
	}
	start() {
		this._countdownBar.style.transition = `width ${this._duration}s linear`
		this._countdownBar.style.webkitTransition = `width ${
			this._duration
		}s linear`
		this._countdownBar.style.transitionDelay = `${this.delay}s`
		this._countdownBar.style.webkitTransitionDelay = `${this.delay}s`
		this._countdownBar.style.width = '0%'
		this.updateSize()
	}
	stop() {
		this._countdownBar.style.width = this._percentage * 100 + '%'
		this._stop = true
	}
	reset() {
		this._countdownBar.style.backgroundColor = 'limegreen'
		this._countdownBar.style.transition = `width 0s linear`
		this._countdownBar.style.webkitTransition = `width 0s linear`
		this._countdownBar.style.transitionDelay = `0s`
		this._countdownBar.style.webkitTransitionDelay = `0s`
		this._countdownBar.style.width = '100%'
		this._width = this._countdownBar.offsetWidth
		this._stop = false
	}
	updateSize() {
		if (this._width === 0 || this._stop) {
			return
		}
		this._width = this._countdownBar.offsetWidth
		this._percentage = this._width / this._initWidth
		if (this._percentage < 0.2) {
			this._countdownBar.style.backgroundColor = 'crimson'
		} else if (this._percentage < 0.4) {
			this._countdownBar.style.backgroundColor = 'orangered'
		} else if (this._percentage < 0.6) {
			this._countdownBar.style.backgroundColor = 'yellow'
		} else if (this._percentage < 0.8) {
			this._countdownBar.style.backgroundColor = 'yellowgreen'
		} else {
			this._countdownBar.style.backgroundColor = 'limegreen'
		}
		requestAnimationFrame(this.updateSize)
	}

	connectedCallback() {
		if (!this.hasAttribute('duration')) {
			this.setAttribute('duration', 5000)
		}
		if (!this.hasAttribute('delay')) {
			this.setAttribute('delay', 0)
		}
		this._stop = false
		this._duration = this.duration / 1000
		this._countdownBar = this.shadowRoot.getElementById('countdown-bar')
		this._initWidth = this._countdownBar.offsetWidth
	}
}

customElements.define('countdown-bar', CountdownBar)
