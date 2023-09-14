import './style.css'

let buttons = []

class Particle {
	constructor(ctx, x, y, color, size, offset) {
		this.ctx = ctx
		this.dx = Math.random() - 0.5
		this.dy = Math.random() - 0.5
		this.baseX = x
		this.baseY = y
		this.x = this.baseX
		this.y = this.baseY
		this.color = color
		this.size = size
		this.ease = (Math.random() * 0.6 + 0.15) * 0.25
		this.offset = offset
	}
	setStartPos() {
		this.x += (this.baseX - this.x) * this.ease
		this.y += (this.baseY - this.y) * this.ease

		return this
	}
	moveParticle() {
		this.x += this.dx * this.ease * 3
		this.y += this.dy * this.ease * 3

		let dx = this.x - this.baseX
		let dy = this.y - this.baseY

		if (dx > this.offset || dx < -this.offset) {
			this.dx *= -1
		}
		if (dy > this.offset || dy < -this.offset) {
			this.dy *= -1
		}

		return this
	}
	draw() {
		this.ctx.beginPath()
		this.ctx.fillStyle = this.color
		this.ctx.arc(this.x, this.y, this.size / 2, 0, 2 * Math.PI)
		this.ctx.fill()
		this.ctx.closePath()

		return this
	}
}

class ButtonParticles {
	constructor(el) {
		this.el = el
		this.canvas = this.el.querySelector('canvas')
		this.ctx = this.canvas.getContext('2d')
		this.scale = 1.3
		this.offset = 6
		this.particles = []
		this.gap = 1
		this.mouseState = false

		this.init()
		this.drawBorder()
		this.transformToParticles()
		this.clear()
		this.draw()

		this.el.addEventListener('mouseenter', () => {
			this.mouseState = true
		})
		this.el.addEventListener('mouseleave', () => {
			this.mouseState = false
		})
	}
	init() {
		let elRect = this.el.getBoundingClientRect()

		this.canvas.width = elRect.width * this.scale
		this.canvas.height = elRect.height * this.scale
	}
	drawBorder() {
		const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)
		gradient.addColorStop(0, '#d916b8')
		gradient.addColorStop(1, '#14ddfc')

		const offset = this.offset * 1.5

		this.ctx.beginPath()
		this.ctx.strokeStyle = gradient
		this.ctx.lineWidth = 4
		this.ctx.moveTo(offset, offset)
		this.ctx.lineTo(this.canvas.width - offset, offset)
		this.ctx.lineTo(this.canvas.width - offset, this.canvas.height - offset)
		this.ctx.lineTo(offset, this.canvas.height - offset)
		this.ctx.closePath()
		this.ctx.stroke()
	}
	transformToParticles() {
		const pixelData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data

		for (let y = 0; y < this.canvas.height; y += this.gap) {
			for (let x = 0; x < this.canvas.width; x += this.gap) {
				const index = (y * this.canvas.width + x) * 4
				const alpha = pixelData[index + 3]

				if (alpha) {
					const red = pixelData[index]
					const green = pixelData[index + 1]
					const blue = pixelData[index + 2]
					const color = `rgb(${red}, ${green}, ${blue})`

					this.particles.push(new Particle(this.ctx, x, y, color, this.gap + 1, this.offset))
				}
			}
		}
	}
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

		return this
	}
	draw() {
		switch (this.mouseState) {
			case true:
				this.particles.forEach((particle) => particle.moveParticle().draw())
				break
			case false:
				this.particles.forEach((particle) => particle.setStartPos().draw())
				break
		}
	}
}

function init() {
	buttons.push(new ButtonParticles(document.querySelector('[data-particle-button]')))
}
init()

function tick() {
	buttons.forEach((btn) => {
		btn.clear().draw()
	})

	requestAnimationFrame(tick)
}
tick()
